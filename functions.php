<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function vibepress_setup() {
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'editor-styles' );
    add_editor_style( 'assets/theme.css' );
    add_theme_support( 'custom-logo' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ) );
    // Read by the VibePress companion plugin; it only works with themes carrying this marker.
    add_theme_support( 'vibepress', array(
        'version'  => 1,
        'project'  => '10f64473-7f76-493f-a71f-93f06b4d9ba6',
        'build'    => '1.0.1794823191',
        'template' => 'vibepress-canvas',
    ) );
}
add_action( 'after_setup_theme', 'vibepress_setup' );

// WordPress caches a theme's pattern list; a re-uploaded zip must not render stale (empty) pages.
function vibepress_refresh_patterns() {
    if ( get_option( 'vibepress_build' ) === '1.0.1794823191' ) {
        return;
    }
    $theme = wp_get_theme();
    if ( method_exists( $theme, 'delete_pattern_cache' ) ) {
        $theme->delete_pattern_cache();
    }
    update_option( 'vibepress_build', '1.0.1794823191' );
}
add_action( 'init', 'vibepress_refresh_patterns', 1 );

function vibepress_assets() {
    wp_enqueue_style( 'vibepress-fonts', get_template_directory_uri() . '/assets/fonts.css', array(), null );
    wp_enqueue_style( 'vibepress-theme', get_template_directory_uri() . '/assets/theme.css', array( 'vibepress-fonts' ), wp_get_theme()->get( 'Version' ) );
    wp_enqueue_script( 'vibepress-motion', get_template_directory_uri() . '/assets/theme.js', array(), wp_get_theme()->get( 'Version' ), true );
}
add_action( 'wp_enqueue_scripts', 'vibepress_assets' );

// Content stays visible until theme.js has measured the viewport. If that script never runs, nothing is hidden.
function vibepress_reveal_flag() {
    wp_print_inline_script_tag( 'setTimeout(function(){if(!window.__vpReveal){document.documentElement.classList.remove("vp-reveal-on");document.documentElement.classList.remove("vp-motion-on");}},3000);' );
}
add_action( 'wp_head', 'vibepress_reveal_flag', 1 );

function vibepress_seo_plugin_active() {
    return defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' )
        || defined( 'SEOPRESS_VERSION' ) || defined( 'THE_SEO_FRAMEWORK_VERSION' ) || defined( 'SLIM_SEO_VER' )
        || class_exists( 'All_in_One_SEO_Pack' );
}

function vibepress_seo_data() {
    static $data = null;
    if ( null === $data ) {
        $data = json_decode( '{"site":"Northline Physio","locale":"en_US","lang":"en","org":{"name":"Northline Physio"},"pages":{"/":{"title":"Physiotherapy in Leeds | Northline Physio","description":"Sports injury and back pain rehabilitation in Leeds. First assessment 45 minutes. Mon–Fri 8am–7pm, Sat 9am–1pm. Book online.","keywords":["physiotherapy Leeds","sports injury rehab Leeds","back pain rehabilitation","Northline Physio","physio appointment online"],"image":"assets/hero.jpg"},"about":{"title":"Physiotherapy Leeds | Northline Physio","description":"Northline Physio in Leeds specializes in sports injury and back pain rehabilitation. Book your physio appointment online.","keywords":["physiotherapy Leeds","sports injury rehab Leeds","back pain rehabilitation","Northline Physio","physio appointment online"],"image":"assets/img-0.jpg"},"rehabilitation":{"title":"Physiotherapy Leeds | Northline Physio","description":"Explore sports injury and back pain rehabilitation services at Northline Physio in Leeds. Book your physio appointment online.","keywords":["physiotherapy Leeds","sports injury rehab Leeds","back pain rehabilitation","Northline Physio","physio appointment online"],"image":"assets/img-8.jpg","faq":[{"q":"Can I book appointments online?","a":"Yes, you can book your appointments online through our website."}]},"fees":{"title":"Physiotherapy Leeds Fees | Northline Physio","description":"Discover the fees for physiotherapy services at Northline Physio in Leeds. Offering sports injury and back pain rehabilitation. Book your physio appointment online.","keywords":["physiotherapy Leeds","sports injury rehab Leeds","back pain rehabilitation","Northline Physio","physio appointment online"],"image":"assets/img-0.jpg","faq":[{"q":"How can I reschedule my appointment?","a":"You can reschedule online through our booking portal."},{"q":"Are evening appointments available?","a":"Yes, we offer appointments until 7pm on weekdays."}]},"book-online":{"title":"Physiotherapy Leeds - Book Online | Northline Physio","description":"Book your physiotherapy appointment online at Northline Physio in Leeds. Specializing in sports injury and back pain rehabilitation.","keywords":["physiotherapy Leeds","sports injury rehab Leeds","back pain rehabilitation","Northline Physio","physio appointment online"],"image":"assets/img-0.jpg","faq":[{"q":"What services can I book online?","a":"You can book appointments for sports injury rehabilitation and back pain rehabilitation."},{"q":"What are your opening hours?","a":"Our clinic is open Monday to Friday from 8am to 7pm, and Saturday from 9am to 1pm."},{"q":"How long is the first assessment?","a":"The first assessment lasts 45 minutes."}]},"contact":{"title":"Physiotherapy Leeds | Contact Northline Physio","description":"Contact Northline Physio in Leeds for sports injury and back pain rehabilitation. Find our opening hours and get in touch for appointments.","keywords":["physiotherapy Leeds","sports injury rehab Leeds","back pain rehabilitation","Northline Physio","physio appointment online"],"image":"assets/img-1.jpg"}}}', true );
    }
    return is_array( $data ) ? $data : array( 'pages' => array() );
}

function vibepress_seo_current() {
    $data = vibepress_seo_data();
    if ( is_front_page() ) {
        return isset( $data['pages']['/'] ) ? $data['pages']['/'] : null;
    }
    if ( ! is_page() ) {
        return null;
    }
    $id   = get_queried_object_id();
    $meta = get_post_meta( $id, '_vibepress_seo', true );
    if ( $meta ) {
        $seo = json_decode( $meta, true );
        if ( is_array( $seo ) ) {
            return $seo;
        }
    }
    $slug = get_post_field( 'post_name', $id );
    return isset( $data['pages'][ $slug ] ) ? $data['pages'][ $slug ] : null;
}

function vibepress_seo_image( $seo ) {
    if ( empty( $seo['image'] ) ) {
        return '';
    }
    $image = (string) $seo['image'];
    if ( 0 === strpos( $image, 'assets/' ) ) {
        return get_theme_file_uri( $image );
    }
    return 0 === strpos( $image, 'https://' ) ? $image : '';
}

function vibepress_seo_title( $title ) {
    if ( vibepress_seo_plugin_active() ) {
        return $title;
    }
    $seo = vibepress_seo_current();
    return ( $seo && ! empty( $seo['title'] ) ) ? wp_strip_all_tags( $seo['title'] ) : $title;
}
add_filter( 'pre_get_document_title', 'vibepress_seo_title', 20 );

function vibepress_seo_head() {
    if ( vibepress_seo_plugin_active() ) {
        return;
    }
    $seo = vibepress_seo_current();
    if ( ! $seo ) {
        return;
    }
    $data  = vibepress_seo_data();
    $front = is_front_page();
    $url   = $front ? home_url( '/' ) : get_permalink();
    $title = ! empty( $seo['title'] ) ? $seo['title'] : wp_get_document_title();
    $desc  = ! empty( $seo['description'] ) ? $seo['description'] : '';
    $image = vibepress_seo_image( $seo );
    $site  = ! empty( $data['site'] ) ? $data['site'] : get_bloginfo( 'name' );

    if ( $front && ! is_singular() ) {
        echo '<link rel="canonical" href="' . esc_url( $url ) . '" />' . "\n";
    }
    if ( $desc ) {
        echo '<meta name="description" content="' . esc_attr( $desc ) . '" />' . "\n";
    }
    $og = array(
        'og:type'        => $front ? 'website' : 'article',
        'og:site_name'   => $site,
        'og:title'       => $title,
        'og:description' => $desc,
        'og:url'         => $url,
        'og:locale'      => $data['locale'],
        'og:image'       => $image,
    );
    foreach ( $og as $property => $content ) {
        if ( '' !== (string) $content ) {
            echo '<meta property="' . esc_attr( $property ) . '" content="' . esc_attr( $content ) . '" />' . "\n";
        }
    }
    echo '<meta name="twitter:card" content="' . ( $image ? 'summary_large_image' : 'summary' ) . '" />' . "\n";

    $org = array(
        '@type' => 'Organization',
        '@id'   => home_url( '/#organization' ),
        'name'  => ! empty( $data['org']['name'] ) ? $data['org']['name'] : $site,
        'url'   => home_url( '/' ),
    );
    if ( ! empty( $data['org']['telephone'] ) ) {
        $org['telephone'] = $data['org']['telephone'];
    }
    if ( ! empty( $data['org']['address'] ) ) {
        $org['address'] = array( '@type' => 'PostalAddress', 'streetAddress' => $data['org']['address'] );
    }
    $logo = get_theme_mod( 'custom_logo' );
    if ( $logo ) {
        $logo_url = wp_get_attachment_image_url( $logo, 'full' );
        if ( $logo_url ) {
            $org['logo'] = $logo_url;
        }
    }
    $graph = array( $org );
    $page  = array(
        '@type'       => 'WebPage',
        '@id'         => $url . '#webpage',
        'url'         => $url,
        'name'        => $title,
        'description' => $desc,
        'inLanguage'  => $data['lang'],
        'isPartOf'    => array( '@id' => home_url( '/#website' ) ),
        'about'       => array( '@id' => home_url( '/#organization' ) ),
    );
    if ( $image ) {
        $page['primaryImageOfPage'] = array( '@type' => 'ImageObject', 'url' => $image );
    }
    $graph[] = array(
        '@type'      => 'WebSite',
        '@id'        => home_url( '/#website' ),
        'url'        => home_url( '/' ),
        'name'       => $site,
        'inLanguage' => $data['lang'],
        'publisher'  => array( '@id' => home_url( '/#organization' ) ),
    );
    $graph[] = $page;
    if ( ! $front ) {
        $graph[] = array(
            '@type'           => 'BreadcrumbList',
            'itemListElement' => array(
                array( '@type' => 'ListItem', 'position' => 1, 'name' => $site, 'item' => home_url( '/' ) ),
                array( '@type' => 'ListItem', 'position' => 2, 'name' => get_the_title(), 'item' => $url ),
            ),
        );
    }
    if ( ! empty( $seo['faq'] ) && is_array( $seo['faq'] ) ) {
        $questions = array();
        foreach ( $seo['faq'] as $entry ) {
            if ( empty( $entry['q'] ) || empty( $entry['a'] ) ) {
                continue;
            }
            $questions[] = array(
                '@type'          => 'Question',
                'name'           => (string) $entry['q'],
                'acceptedAnswer' => array( '@type' => 'Answer', 'text' => (string) $entry['a'] ),
            );
        }
        if ( $questions ) {
            $graph[] = array( '@type' => 'FAQPage', '@id' => $url . '#faq', 'mainEntity' => $questions );
        }
    }
    $json = wp_json_encode( array( '@context' => 'https://schema.org', '@graph' => $graph ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP );
    if ( $json ) {
        echo '<script type="application/ld+json">' . $json . '</script>' . "\n";
    }
}
add_action( 'wp_head', 'vibepress_seo_head', 2 );

function vibepress_page_blocks( $slug ) {
    $file = get_theme_file_path( 'patterns/page-' . $slug . '.php' );
    if ( ! file_exists( $file ) ) {
        return '';
    }
    ob_start();
    include $file;
    return trim( (string) ob_get_clean() );
}

function vibepress_seed_pages() {
    $pages = array(
        array( 'about', 'About', 'xhnhc1bh' ),
        array( 'rehabilitation', 'Rehabilitation', 'eiaxf9h8' ),
        array( 'fees', 'Fees', '5npkk5k0' ),
        array( 'book-online', 'Book online', '1mrrvh25' ),
        array( 'contact', 'Contact', '60sk3myt' )
    );
    $key = md5( 'body-v2|' . wp_json_encode( $pages ) );
    if ( '' === get_option( 'permalink_structure' ) ) {
        update_option( 'permalink_structure', '/%postname%/' );
        flush_rewrite_rules();
    }
    // Sections carry inline styles, iframes and data attributes that kses would strip for users without unfiltered_html.
    $kses = false !== has_filter( 'content_save_pre', 'wp_filter_post_kses' );
    if ( $kses ) {
        kses_remove_filters();
    }
    foreach ( $pages as $page ) {
        list( $slug, $title, $vp_id ) = $page;
        $content  = vibepress_page_blocks( $slug );
        $existing = get_page_by_path( $slug );
        if ( '' === $content ) {
            continue;
        }
        if ( $existing ) {
            // Only pages VibePress made; a newer build replaces their body, and the old body stays in the page's revisions.
            $ours = get_post_meta( $existing->ID, '_vibepress_page_id', true ) || false !== strpos( $existing->post_content, 'Design for this page lives in the Site Editor' );
            if ( ! $ours || $existing->post_content === $content ) {
                continue;
            }
            $id = wp_update_post( array( 'ID' => $existing->ID, 'post_content' => wp_slash( $content ) ) );
        } else {
            $id = wp_insert_post( array(
                'post_title'   => wp_slash( $title ),
                'post_name'    => $slug,
                'post_status'  => 'publish',
                'post_type'    => 'page',
                'post_content' => wp_slash( $content ),
            ) );
        }
        if ( ! $id || is_wp_error( $id ) ) {
            continue;
        }
        update_post_meta( $id, '_wp_page_template', 'vibepress-canvas' );
        update_post_meta( $id, '_vibepress_page_id', $vp_id );
        update_post_meta( $id, '_vibepress_hash', md5( get_post_field( 'post_content', $id, 'raw' ) ) );
    }
    if ( $kses ) {
        kses_init_filters();
    }
    update_option( 'vibepress_pages_seeded', $key );
}

function vibepress_nav_blocks() {
    $items = array(
        array( 'Home', '/' ),
        array( 'About', '/about/' ),
        array( 'Rehabilitation', '/rehabilitation/' ),
        array( 'Fees', '/fees/' ),
        array( 'Book online', '/book-online/' ),
        array( 'Contact', '/contact/' )
    );
    $out = '';
    foreach ( $items as $item ) {
        $path  = trim( $item[1], '/' );
        $page  = ( $path && '#' !== $item[1] ) ? get_page_by_path( $path ) : null;
        $attrs = $page
            ? array( 'label' => $item[0], 'type' => 'page', 'id' => $page->ID, 'url' => get_permalink( $page ), 'kind' => 'post-type' )
            : array( 'label' => $item[0], 'url' => '#' === $item[1] ? '#' : home_url( $item[1] ), 'kind' => 'custom' );
        $out .= '<!-- wp:navigation-link ' . wp_json_encode( $attrs, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . ' /-->';
    }
    return $out;
}

function vibepress_seed_navigation() {
    $content = vibepress_nav_blocks();
    $id      = (int) get_option( 'vibepress_nav_id' );
    $post    = $id ? get_post( $id ) : null;
    if ( $post && 'wp_navigation' === $post->post_type && 'trash' !== $post->post_status ) {
        if ( $post->post_content === get_option( 'vibepress_nav_seeded' ) && $post->post_content !== $content ) {
            wp_update_post( array( 'ID' => $id, 'post_content' => wp_slash( $content ) ) );
            update_option( 'vibepress_nav_seeded', $content );
        }
        return;
    }
    $id = wp_insert_post( array(
        'post_title'   => 'VibePress menu',
        'post_type'    => 'wp_navigation',
        'post_status'  => 'publish',
        'post_content' => wp_slash( $content ),
    ) );
    if ( $id && ! is_wp_error( $id ) ) {
        update_option( 'vibepress_nav_id', (int) $id );
        update_option( 'vibepress_nav_seeded', $content );
    }
}

function vibepress_nav_ref_attr() {
    $id = (int) get_option( 'vibepress_nav_id' );
    return ( $id && 'publish' === get_post_status( $id ) ) ? '"ref":' . $id . ',' : '';
}

// Saving in the Site Editor (or sending the homepage from the VibePress plugin) stores a database copy of a template,
// and WordPress shows that copy instead of this theme's files. A newer build is the newer design, so an untouched
// plugin copy is removed and any other copy is set aside under a backup name, never deleted.
function vibepress_release_overrides() {
    global $wpdb;
    $moved = array();
    $stamp = gmdate( 'Y-m-d H:i' );
    foreach ( array( 'wp_template', 'wp_template_part' ) as $type ) {
        $posts = get_posts( array(
            'post_type'     => $type,
            'post_status'   => array( 'publish', 'draft' ),
            'numberposts'   => 50,
            'post_name__in' => array( 'front-page', 'index', 'home', '404', 'page', 'single', 'vibepress-canvas', 'header', 'footer' ),
            'tax_query'     => array( array( 'taxonomy' => 'wp_theme', 'field' => 'name', 'terms' => get_stylesheet() ) ),
        ) );
        foreach ( $posts as $post ) {
            if ( get_post_meta( $post->ID, '_vibepress_home', true ) && md5( $post->post_content ) === get_post_meta( $post->ID, '_vibepress_hash', true ) ) {
                wp_delete_post( $post->ID, true );
                continue;
            }
            // Renamed in place so the content is not re-filtered on save.
            $wpdb->update(
                $wpdb->posts,
                array(
                    'post_name'  => 'vibepress-backup-' . $post->post_name . '-' . gmdate( 'YmdHi' ),
                    'post_title' => $post->post_title . ' (backup ' . $stamp . ')',
                ),
                array( 'ID' => $post->ID )
            );
            clean_post_cache( $post->ID );
            $moved[] = $post->post_title;
        }
    }
    delete_option( 'vibepress_home_css' );
    if ( $moved ) {
        update_option( 'vibepress_moved_overrides', $moved, false );
    }
}

function vibepress_moved_notice() {
    $moved = get_option( 'vibepress_moved_overrides' );
    if ( ! $moved || ! current_user_can( 'edit_theme_options' ) ) {
        return;
    }
    delete_option( 'vibepress_moved_overrides' );
    $ja    = 0 === strpos( get_user_locale(), 'ja' );
    $names = implode( $ja ? '、' : ', ', array_map( 'strval', (array) $moved ) );
    $text  = $ja
        ? '新しいデザインに切り替えました。サイトエディターで保存されていた古いテンプレート（' . $names . '）は、名前に「backup」を付けて 外観 → エディター → テンプレート に残してあります。'
        : 'Switched to the new design. Templates saved earlier in the Site Editor (' . $names . ') are kept with “backup” in their name under Appearance → Editor → Templates.';
    echo '<div class="notice notice-info is-dismissible"><p>' . esc_html( $text ) . '</p></div>';
}
add_action( 'admin_notices', 'vibepress_moved_notice' );

// Runs on activation and again after a re-uploaded build; existing pages and an edited menu are left alone.
function vibepress_sync_site() {
    if ( get_option( 'vibepress_synced_build' ) === '1.0.1794823191' ) {
        return;
    }
    if ( function_exists( 'vibepress_seed_pages' ) ) {
        vibepress_seed_pages();
    }
    vibepress_seed_navigation();
    
    vibepress_release_overrides();
    update_option( 'vibepress_synced_build', '1.0.1794823191' );
}
add_action( 'after_switch_theme', 'vibepress_sync_site' );
add_action( 'admin_init', 'vibepress_sync_site' );
