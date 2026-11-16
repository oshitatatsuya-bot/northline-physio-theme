<?php
/**
 * Title: Header
 * Slug: northline-physio/header
 * Inserter: no
 */
?>
<!-- wp:group {"className":"vp-header vp-header-split","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
<div class="wp-block-group vp-header vp-header-split">
<!-- wp:site-title {"level":0,"className":"vp-logo"} /-->
<!-- wp:navigation {<?php echo function_exists( 'vibepress_nav_ref_attr' ) ? vibepress_nav_ref_attr() : ''; ?>"overlayMenu":"never","className":"vp-nav"} -->
<!-- wp:navigation-link {"label":"Home","url":"<?php echo esc_url( home_url( '/' ) ); ?>"} /-->
<!-- wp:navigation-link {"label":"About","url":"<?php echo esc_url( home_url( '/about/' ) ); ?>"} /-->
<!-- wp:navigation-link {"label":"Rehabilitation","url":"<?php echo esc_url( home_url( '/rehabilitation/' ) ); ?>"} /-->
<!-- wp:navigation-link {"label":"Fees","url":"<?php echo esc_url( home_url( '/fees/' ) ); ?>"} /-->
<!-- wp:navigation-link {"label":"Book online","url":"<?php echo esc_url( home_url( '/book-online/' ) ); ?>"} /-->
<!-- wp:navigation-link {"label":"Contact","url":"<?php echo esc_url( home_url( '/contact/' ) ); ?>"} /-->
<!-- /wp:navigation -->
</div>
<!-- /wp:group -->
