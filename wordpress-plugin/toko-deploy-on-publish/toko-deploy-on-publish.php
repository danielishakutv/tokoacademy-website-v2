<?php
/**
 * Plugin Name:       Toko Academy — Deploy on Publish
 * Plugin URI:        https://tokoacademy.org
 * Description:       Instantly rebuilds and redeploys the static tokoacademy.org site whenever a post is published or updated, by triggering a GitHub Actions deploy (workflow_dispatch, falling back to repository_dispatch). Replaces hourly polling.
 * Version:           1.1.0
 * Author:            Toko Academy
 * License:           GPL-2.0-or-later
 * Requires PHP:      7.2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const TOKO_DEPLOY_OWNER      = 'danielishakutv';
const TOKO_DEPLOY_REPO       = 'tokoacademy-website-v2';
const TOKO_DEPLOY_EVENT_TYPE = 'wordpress_update';
const TOKO_DEPLOY_THROTTLE   = 30; // seconds — coalesce a burst of saves into one deploy
const TOKO_DEPLOY_WORKFLOW   = 'deploy.yml';
const TOKO_DEPLOY_REF        = 'master';

/**
 * Resolve the GitHub token: prefer a wp-config constant, else the saved option.
 */
function toko_deploy_token() {
	if ( defined( 'TOKO_DEPLOY_GH_TOKEN' ) && TOKO_DEPLOY_GH_TOKEN ) {
		return TOKO_DEPLOY_GH_TOKEN;
	}
	return trim( (string) get_option( 'toko_deploy_gh_token', '' ) );
}

/**
 * Send one trigger to GitHub and report what came back.
 *
 * Two endpoints do the same job here, and they need very different trust:
 *
 * - `workflow_dispatch` runs a named workflow. A fine-grained token needs only
 *   **Actions: Read and write** — the right to start a job, and nothing else.
 * - `repository_dispatch` (the original call) needs **Contents: Read and
 *   write**, which is also the permission to rewrite this repository's source.
 *   A token with that scope, sitting in a WordPress database, means anyone who
 *   gets into WordPress can push whatever they like into the site's code and
 *   watch this very workflow deploy it.
 *
 * So `workflow` is tried first and whichever one works is remembered. Nothing
 * has to be changed in a particular order: an existing Contents token keeps
 * working through the fallback, and the day its scope is narrowed to Actions
 * the plugin switches by itself.
 *
 * @return array{ok:bool,msg:string}
 */
function toko_deploy_try( $method, $token, $reason ) {
	if ( 'workflow' === $method ) {
		$url  = sprintf(
			'https://api.github.com/repos/%s/%s/actions/workflows/%s/dispatches',
			TOKO_DEPLOY_OWNER,
			TOKO_DEPLOY_REPO,
			rawurlencode( TOKO_DEPLOY_WORKFLOW )
		);
		$body = array( 'ref' => (string) apply_filters( 'toko_deploy_ref', TOKO_DEPLOY_REF ) );
	} else {
		$url  = sprintf( 'https://api.github.com/repos/%s/%s/dispatches', TOKO_DEPLOY_OWNER, TOKO_DEPLOY_REPO );
		$body = array(
			'event_type'     => TOKO_DEPLOY_EVENT_TYPE,
			'client_payload' => array( 'reason' => (string) $reason ),
		);
	}

	$response = wp_remote_post( $url, array(
		'timeout' => 20,
		'headers' => array(
			'Authorization'        => 'Bearer ' . $token,
			'Accept'               => 'application/vnd.github+json',
			'Content-Type'         => 'application/json',
			'User-Agent'           => 'Toko-Deploy-Plugin',
			'X-GitHub-Api-Version' => '2022-11-28',
		),
		'body'    => wp_json_encode( $body ),
	) );

	if ( is_wp_error( $response ) ) {
		return array( 'ok' => false, 'msg' => 'request failed: ' . $response->get_error_message() );
	}

	$code = (int) wp_remote_retrieve_response_code( $response );
	if ( $code >= 200 && $code < 300 ) { // GitHub returns 204 on success
		return array( 'ok' => true, 'msg' => 'HTTP ' . $code );
	}

	// Truncated: GitHub's error bodies are long and this string is shown in wp-admin.
	$detail = trim( wp_strip_all_tags( (string) wp_remote_retrieve_body( $response ) ) );
	if ( strlen( $detail ) > 200 ) {
		$detail = substr( $detail, 0, 200 ) . '…';
	}
	return array( 'ok' => false, 'msg' => 'HTTP ' . $code . ( $detail ? ' — ' . $detail : '' ) );
}

/**
 * Trigger a GitHub Actions deploy. Returns true on success.
 *
 * @param string $reason Human-readable trigger reason (recorded for the admin page).
 * @param bool   $force  Bypass the throttle (used by the manual "Deploy now" button).
 */
function toko_deploy_dispatch( $reason, $force = false ) {
	$token = toko_deploy_token();
	if ( ! $token ) {
		update_option( 'toko_deploy_last', array(
			'time' => current_time( 'mysql' ),
			'ok'   => false,
			'msg'  => 'No GitHub token set — add one under Settings → Toko Deploy.',
		) );
		return false;
	}

	if ( ! $force && get_transient( 'toko_deploy_lock' ) ) {
		return false; // a deploy was just triggered; coalesce duplicates
	}
	set_transient( 'toko_deploy_lock', 1, TOKO_DEPLOY_THROTTLE );

	// Try whichever endpoint worked last time first, so the common path is one call.
	$order  = ( 'repository' === get_option( 'toko_deploy_method' ) )
		? array( 'repository', 'workflow' )
		: array( 'workflow', 'repository' );
	$errors = array();

	foreach ( $order as $method ) {
		$result = toko_deploy_try( $method, $token, $reason );
		if ( $result['ok'] ) {
			update_option( 'toko_deploy_method', $method );
			update_option( 'toko_deploy_last', array(
				'time'   => current_time( 'mysql' ),
				'ok'     => true,
				'reason' => (string) $reason,
				'msg'    => sprintf(
					'Deploy triggered via %s_dispatch (%s).',
					$method,
					$result['msg']
				),
			) );
			return true;
		}
		$errors[] = $method . '_dispatch ' . $result['msg'];
	}

	update_option( 'toko_deploy_last', array(
		'time'   => current_time( 'mysql' ),
		'ok'     => false,
		'reason' => (string) $reason,
		'msg'    => 'GitHub refused both triggers — ' . implode( ' · ', $errors ),
	) );
	return false;
}

/**
 * Trigger a deploy when a post is published, edited while published, or unpublished.
 */
function toko_deploy_on_transition( $new_status, $old_status, $post ) {
	if ( wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) ) {
		return;
	}
	// News, events and gallery are all the built-in "post" type. Extend via the filter.
	$watched = apply_filters( 'toko_deploy_post_types', array( 'post' ) );
	if ( ! in_array( $post->post_type, $watched, true ) ) {
		return;
	}
	// Relevant only when the post becomes, stays, or leaves "published".
	if ( 'publish' === $new_status || 'publish' === $old_status ) {
		toko_deploy_dispatch( $old_status . ' → ' . $new_status . ' · ' . $post->post_type . ' #' . $post->ID );
	}
}
add_action( 'transition_post_status', 'toko_deploy_on_transition', 10, 3 );

/* ------------------------------- Admin page ------------------------------- */

add_action( 'admin_menu', function () {
	add_options_page( 'Toko Deploy', 'Toko Deploy', 'manage_options', 'toko-deploy', 'toko_deploy_render_settings' );
} );

add_action( 'admin_init', function () {
	register_setting( 'toko_deploy_group', 'toko_deploy_gh_token', array(
		'type'              => 'string',
		// Never let this reach the REST API. It is the default, said out loud
		// so a future change to that default cannot publish the token.
		'show_in_rest'      => false,
		'sanitize_callback' => 'toko_deploy_sanitize_token',
	) );
} );

/**
 * Keep the saved token when the box is submitted empty.
 *
 * The form no longer prints the token, so an empty field means "I did not
 * change it", not "delete it". Clearing is a deliberate act — the Forget
 * button below.
 */
function toko_deploy_sanitize_token( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return trim( (string) get_option( 'toko_deploy_gh_token', '' ) );
	}
	return $value;
}

/** Enough of a saved token to recognise it by, and no more. */
function toko_deploy_token_hint( $token ) {
	$token = (string) $token;
	return strlen( $token ) > 4 ? '…' . substr( $token, -4 ) : '…';
}

// Handle the "Deploy now" test button (bypasses the throttle).
add_action( 'admin_post_toko_deploy_now', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'Not allowed.' );
	}
	check_admin_referer( 'toko_deploy_now' );
	toko_deploy_dispatch( 'Manual test from WP admin', true );
	wp_safe_redirect( admin_url( 'options-general.php?page=toko-deploy&tested=1' ) );
	exit;
} );

// Handle the "Forget saved token" button.
add_action( 'admin_post_toko_deploy_forget', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'Not allowed.' );
	}
	check_admin_referer( 'toko_deploy_forget' );
	update_option( 'toko_deploy_gh_token', '' );
	wp_safe_redirect( admin_url( 'options-general.php?page=toko-deploy&forgot=1' ) );
	exit;
} );

function toko_deploy_render_settings() {
	$has_const = defined( 'TOKO_DEPLOY_GH_TOKEN' ) && TOKO_DEPLOY_GH_TOKEN;
	$last      = get_option( 'toko_deploy_last' );
	?>
	<div class="wrap">
		<h1>Toko Deploy</h1>
		<p>Rebuilds &amp; redeploys <strong>tokoacademy.org</strong> automatically whenever you publish or update a post
			(<code><?php echo esc_html( TOKO_DEPLOY_OWNER . '/' . TOKO_DEPLOY_REPO ); ?></code>).</p>

		<?php if ( isset( $_GET['tested'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<div class="notice notice-info is-dismissible"><p>Test deploy requested — check the repo's <strong>Actions</strong> tab.</p></div>
		<?php endif; ?>

		<?php if ( isset( $_GET['forgot'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<div class="notice notice-warning is-dismissible"><p>Saved token removed. Deploys will not run until you save a new one — and revoke the old one on GitHub.</p></div>
		<?php endif; ?>

		<?php if ( is_array( $last ) ) : ?>
			<div class="notice <?php echo $last['ok'] ? 'notice-success' : 'notice-error'; ?>">
				<p><strong>Last trigger:</strong> <?php echo esc_html( $last['time'] ); ?> — <?php echo esc_html( $last['msg'] ); ?></p>
			</div>
		<?php endif; ?>

		<form method="post" action="options.php">
			<?php settings_fields( 'toko_deploy_group' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="toko_deploy_gh_token">GitHub token</label></th>
					<td>
						<?php if ( $has_const ) : ?>
							<p><em>Set via the <code>TOKO_DEPLOY_GH_TOKEN</code> constant in <code>wp-config.php</code> (recommended). The field below is ignored.</em></p>
						<?php else : ?>
							<?php
							// The token is never printed back into this page. A password
							// field still puts the real characters in the HTML source, where
							// any browser extension, cached copy or shoulder can read them,
							// and every administrator who opens Settings gets a copy of a
							// credential that can deploy the live website.
							$saved = trim( (string) get_option( 'toko_deploy_gh_token', '' ) );
							?>
							<input type="password" id="toko_deploy_gh_token" name="toko_deploy_gh_token"
								value="" class="regular-text" autocomplete="off"
								placeholder="<?php echo $saved ? 'github_pat_… (a token is saved)' : 'github_pat_...'; ?>" />
							<p class="description">
								<?php if ( $saved ) : ?>
									A token ending <code><?php echo esc_html( toko_deploy_token_hint( $saved ) ); ?></code> is saved.
									Leave this blank to keep it; type a new one to replace it.<br />
								<?php endif; ?>
								Fine-grained token on <code><?php echo esc_html( TOKO_DEPLOY_OWNER . '/' . TOKO_DEPLOY_REPO ); ?></code> with
								<strong>Actions: Read and write</strong> — the right to start a deploy and nothing else.
								<em>Contents: Read and write</em> also works (it is what older setups used) but it is the
								permission to rewrite the site's source code, so prefer Actions.
								See the plugin README for the exact steps.
							</p>
						<?php endif; ?>
					</td>
				</tr>
			</table>
			<?php submit_button( 'Save token' ); ?>
		</form>

		<hr />
		<h2>Test</h2>
		<p>Send a deploy right now, then watch the repo's Actions tab go green.</p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="toko_deploy_now" />
			<?php wp_nonce_field( 'toko_deploy_now' ); ?>
			<?php submit_button( 'Deploy now (test)', 'secondary' ); ?>
		</form>

		<?php if ( ! $has_const && trim( (string) get_option( 'toko_deploy_gh_token', '' ) ) ) : ?>
			<hr />
			<h2>Remove the saved token</h2>
			<p>Use this if the token may have been seen by somebody it should not have been.
				Removing it here stops deploys; <strong>revoke it on GitHub as well</strong>, because
				anything that already has a copy keeps working until you do.</p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="toko_deploy_forget" />
				<?php wp_nonce_field( 'toko_deploy_forget' ); ?>
				<?php submit_button( 'Forget saved token', 'delete' ); ?>
			</form>
		<?php endif; ?>
	</div>
	<?php
}
