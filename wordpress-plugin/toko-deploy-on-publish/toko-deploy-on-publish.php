<?php
/**
 * Plugin Name:       Toko Academy — Deploy on Publish
 * Plugin URI:        https://tokoacademy.org
 * Description:       Instantly rebuilds and redeploys the static tokoacademy.org site whenever a post is published or updated, by triggering a GitHub Actions deploy (repository_dispatch). Replaces hourly polling.
 * Version:           1.0.0
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
 * Fire a repository_dispatch to GitHub Actions. Returns true on success (HTTP 2xx).
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

	$url = sprintf( 'https://api.github.com/repos/%s/%s/dispatches', TOKO_DEPLOY_OWNER, TOKO_DEPLOY_REPO );

	$response = wp_remote_post( $url, array(
		'timeout' => 20,
		'headers' => array(
			'Authorization'        => 'Bearer ' . $token,
			'Accept'               => 'application/vnd.github+json',
			'Content-Type'         => 'application/json',
			'User-Agent'           => 'Toko-Deploy-Plugin',
			'X-GitHub-Api-Version' => '2022-11-28',
		),
		'body'    => wp_json_encode( array(
			'event_type'     => TOKO_DEPLOY_EVENT_TYPE,
			'client_payload' => array( 'reason' => (string) $reason ),
		) ),
	) );

	if ( is_wp_error( $response ) ) {
		update_option( 'toko_deploy_last', array(
			'time' => current_time( 'mysql' ),
			'ok'   => false,
			'msg'  => 'Request failed: ' . $response->get_error_message(),
		) );
		return false;
	}

	$code = (int) wp_remote_retrieve_response_code( $response );
	$ok   = ( $code >= 200 && $code < 300 ); // GitHub returns 204 on success
	update_option( 'toko_deploy_last', array(
		'time'   => current_time( 'mysql' ),
		'ok'     => $ok,
		'reason' => (string) $reason,
		'msg'    => $ok
			? 'Deploy triggered (HTTP ' . $code . ').'
			: 'GitHub returned HTTP ' . $code . ': ' . wp_remote_retrieve_body( $response ),
	) );
	return $ok;
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
	register_setting( 'toko_deploy_group', 'toko_deploy_gh_token', array( 'sanitize_callback' => 'trim' ) );
} );

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
							<input type="password" id="toko_deploy_gh_token" name="toko_deploy_gh_token"
								value="<?php echo esc_attr( get_option( 'toko_deploy_gh_token', '' ) ); ?>"
								class="regular-text" autocomplete="off" placeholder="github_pat_..." />
							<p class="description">
								Fine-grained token with <strong>Contents: Read and write</strong> on
								<code><?php echo esc_html( TOKO_DEPLOY_OWNER . '/' . TOKO_DEPLOY_REPO ); ?></code>.
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
	</div>
	<?php
}
