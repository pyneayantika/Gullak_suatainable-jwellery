{
  "brand": {
    "name": "Gullak",
    "essence": ["Timeless", "Elegant", "Natural", "Ethical", "Handcrafted", "Slow Luxury", "Authentic"],
    "promise": "Wear Nature. Wear Stories. Wear Craft.",
    "design_personality": {
      "keywords": ["editorial", "museum-calm", "artisan-studio", "wabi-sabi", "warm minimal"],
      "do": [
        "Use generous whitespace and an editorial rhythm (image → short copy → breathing space).",
        "Prefer tactile surfaces: paper grain, linen, clay textures (subtle).",
        "Use asymmetry and offset grids (not centered, not perfectly mirrored).",
        "Keep commerce UI quiet: minimal badges, no discount-first patterns."
      ],
      "dont": [
        "No neon, no glossy gradients, no loud promo banners.",
        "Avoid dense card grids with heavy borders.",
        "Avoid excessive animation; motion should feel slow and intentional."
      ]
    }
  },

  "typography": {
    "google_fonts": {
      "serif_headings": {
        "family": "Cormorant Garamond",
        "weights": [400, 500, 600],
        "usage": "H1/H2, editorial pull quotes, product names"
      },
      "sans_ui_body": {
        "family": "Manrope",
        "weights": [400, 500, 600],
        "usage": "Body, UI labels, navigation, forms"
      },
      "mono_optional": {
        "family": "Azeret Mono",
        "weights": [400, 500],
        "usage": "Order IDs, SKU, admin tables (sparingly)"
      },
      "import_instruction": "Use Google Fonts <link> in public/index.html (React .js project). Load display=swap."
    },
    "type_scale_tailwind": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-[var(--font-serif)] tracking-[-0.02em] leading-[1.05]",
      "h2": "text-base md:text-lg font-[var(--font-sans)] text-[color:var(--ink-2)] leading-[1.6]",
      "h3": "text-xl sm:text-2xl font-[var(--font-serif)] tracking-[-0.01em]",
      "body": "text-sm sm:text-base font-[var(--font-sans)] leading-[1.75] text-[color:var(--ink-1)]",
      "small": "text-xs sm:text-sm font-[var(--font-sans)] text-[color:var(--ink-2)]"
    },
    "editorial_rules": [
      "Headings: serif, slightly tighter tracking; body: sans with generous line-height.",
      "Use sentence case for most UI; reserve ALL CAPS for tiny overlines only (tracking-widest).",
      "Max line length for reading blocks: 62–72ch (use max-w-prose / max-w-[70ch])."
    ]
  },

  "color_system": {
    "notes": [
      "User-specified palette translated into exact HEX tokens.",
      "Primary surfaces should be Ivory/Warm Sand; Terracotta used as accent blocks and CTAs.",
      "No saturated/dark gradients; keep gradients mild and decorative only (<=20% viewport)."
    ],
    "palette_hex": {
      "terracotta_deep": "#8A3F2B",
      "burnt_clay": "#B35A3C",
      "earth_brown": "#4A342E",

      "ivory": "#F7F1E6",
      "warm_sand": "#E9DDC9",
      "natural_beige": "#D8C7AE",
      "muted_taupe": "#A8927E",

      "sage_green": "#8FA58E",
      "olive": "#6F7D4E",
      "forest_green": "#1F3A2E",
      "soft_copper": "#B07A5A",

      "charcoal": "#1F1B18",
      "warm_black": "#141110",
      "paper_white": "#FFFCF7"
    },
    "semantic_tokens_css": {
      "instruction": "Set these as CSS custom properties in /app/frontend/src/index.css under :root (shadcn tokens + brand tokens).",
      "css": {
        "--bg": "var(--ivory)",
        "--bg-2": "var(--warm-sand)",
        "--surface": "var(--paper-white)",
        "--surface-2": "#F2E8DA",

        "--ink-1": "var(--charcoal)",
        "--ink-2": "#4B3F39",
        "--ink-3": "#7A6A60",

        "--brand": "var(--terracotta-deep)",
        "--brand-2": "var(--burnt-clay)",
        "--accent": "var(--sage-green)",
        "--accent-2": "var(--olive)",

        "--border-subtle": "rgba(74,52,46,0.14)",
        "--ring": "rgba(138,63,43,0.35)",

        "--success": "#2F6B4F",
        "--warning": "#9A6A2F",
        "--danger": "#9B3A2F"
      }
    },
    "shadcn_hsl_mapping": {
      "instruction": "Map brand colors into shadcn HSL variables (approx). Keep background warm and foreground charcoal.",
      "root_hsl": {
        "--background": "36 44% 93%",
        "--foreground": "20 12% 10%",
        "--card": "36 60% 97%",
        "--card-foreground": "20 12% 10%",
        "--popover": "36 60% 97%",
        "--popover-foreground": "20 12% 10%",
        "--primary": "14 52% 36%",
        "--primary-foreground": "36 60% 97%",
        "--secondary": "34 33% 85%",
        "--secondary-foreground": "20 12% 10%",
        "--muted": "34 28% 88%",
        "--muted-foreground": "22 10% 35%",
        "--accent": "110 12% 60%",
        "--accent-foreground": "20 12% 10%",
        "--border": "22 14% 78%",
        "--input": "22 14% 78%",
        "--ring": "14 52% 36%",
        "--radius": "0.75rem"
      }
    }
  },

  "texture_and_gradients": {
    "grain": {
      "instruction": "Add a subtle noise overlay via CSS (pseudo-element) on large section backgrounds only.",
      "css_snippet": ".grain-bg{position:relative;} .grain-bg:before{content:'';position:absolute;inset:0;pointer-events:none;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.08%22/%3E%3C/svg%3E');mix-blend-mode:multiply;opacity:.35;}"
    },
    "allowed_gradients": [
      {
        "name": "hero-warm-wash",
        "usage": "Hero background only (<=20% viewport)",
        "tailwind": "bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(179,90,60,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(143,165,142,0.16),transparent_60%)]"
      }
    ],
    "gradient_restriction_rule": "NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element. NEVER let gradients cover more than 20% of the viewport. NEVER apply gradients to text-heavy content or reading areas. NEVER use gradients on small UI elements (<100px width). NEVER stack multiple gradient layers in the same viewport."
  },

  "layout_and_grid": {
    "container": {
      "default": "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
      "editorial_wide": "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10"
    },
    "grid_rules": [
      "Use 12-col grid on desktop, 4-col on mobile.",
      "Prefer offset compositions: e.g., image spans 7 cols, text spans 4 cols with 1-col gutter.",
      "Use vertical rhythm: section padding py-14 sm:py-18 lg:py-24."
    ],
    "spacing_scale": {
      "tokens_px": {"2": 8, "3": 12, "4": 16, "6": 24, "8": 32, "10": 40, "12": 48, "14": 56, "16": 64, "18": 72, "24": 96},
      "rule": "Use 2–3x more spacing than feels comfortable; avoid cramped ecommerce density."
    },
    "radius_and_shadow": {
      "radius": {
        "sm": "rounded-md",
        "md": "rounded-xl",
        "lg": "rounded-2xl"
      },
      "shadow": {
        "card": "shadow-[0_10px_30px_rgba(20,17,16,0.08)]",
        "hover": "hover:shadow-[0_14px_40px_rgba(20,17,16,0.12)]"
      }
    }
  },

  "motion": {
    "library": {
      "name": "framer-motion",
      "usage": "Gentle fades, slow image zoom on hover, organic reveals. Avoid bouncy easing."
    },
    "principles": [
      "Duration: 180–240ms for UI hover; 420–700ms for section reveals.",
      "Easing: use easeOut / cubic-bezier(0.16, 1, 0.3, 1).",
      "Respect prefers-reduced-motion: disable parallax and large transforms."
    ],
    "micro_interactions": {
      "buttons": "hover: translateY(-1px) + subtle shadow; active: scale(0.98)",
      "product_cards": "image slow zoom (scale 1.03) + caption underline reveal",
      "nav": "underline grows from left on hover; active state uses terracotta"
    }
  },

  "components": {
    "component_path": {
      "shadcn_primary": "/app/frontend/src/components/ui",
      "use_components": [
        {"name": "button", "path": "components/ui/button.jsx"},
        {"name": "card", "path": "components/ui/card.jsx"},
        {"name": "badge", "path": "components/ui/badge.jsx"},
        {"name": "sheet", "path": "components/ui/sheet.jsx", "usage": "Cart drawer"},
        {"name": "drawer", "path": "components/ui/drawer.jsx", "usage": "Mobile filters"},
        {"name": "tabs", "path": "components/ui/tabs.jsx", "usage": "PDP sections / admin"},
        {"name": "accordion", "path": "components/ui/accordion.jsx", "usage": "Care guide, shipping/returns"},
        {"name": "select", "path": "components/ui/select.jsx", "usage": "Sort, variants"},
        {"name": "checkbox", "path": "components/ui/checkbox.jsx", "usage": "Filters"},
        {"name": "slider", "path": "components/ui/slider.jsx", "usage": "Price range"},
        {"name": "pagination", "path": "components/ui/pagination.jsx"},
        {"name": "dialog", "path": "components/ui/dialog.jsx", "usage": "Quick view / wishlist confirm"},
        {"name": "form", "path": "components/ui/form.jsx", "usage": "Checkout, admin CRUD"},
        {"name": "input", "path": "components/ui/input.jsx"},
        {"name": "textarea", "path": "components/ui/textarea.jsx"},
        {"name": "table", "path": "components/ui/table.jsx", "usage": "Admin lists"},
        {"name": "sonner", "path": "components/ui/sonner.jsx", "usage": "Toasts"},
        {"name": "calendar", "path": "components/ui/calendar.jsx", "usage": "Admin scheduling if needed"}
      ]
    },

    "button_system": {
      "tokens": {
        "--btn-radius": "12px",
        "--btn-height": "44px",
        "--btn-pad-x": "18px",
        "--btn-shadow": "0 10px 24px rgba(20,17,16,0.10)",
        "--btn-shadow-hover": "0 14px 34px rgba(20,17,16,0.14)"
      },
      "variants": {
        "primary": {
          "description": "Terracotta filled, ivory text",
          "tailwind": "bg-[color:var(--brand)] text-[color:var(--surface)] hover:bg-[color:var(--brand-2)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] shadow-[var(--btn-shadow)] hover:shadow-[var(--btn-shadow-hover)]",
          "data_testid": "primary-action-button"
        },
        "secondary": {
          "description": "Sand surface with border, charcoal text",
          "tailwind": "bg-[color:var(--bg-2)] text-[color:var(--ink-1)] border border-[color:var(--border-subtle)] hover:bg-[color:var(--surface-2)]",
          "data_testid": "secondary-action-button"
        },
        "ghost": {
          "description": "Text button with underline reveal",
          "tailwind": "bg-transparent text-[color:var(--ink-1)] hover:bg-[rgba(179,90,60,0.08)]",
          "data_testid": "ghost-action-button"
        }
      },
      "interaction_rules": [
        "No transition:all. Use transition-colors and transition-shadow only.",
        "Active state: scale-95 (only on button element).",
        "Always show focus-visible ring with terracotta tint."
      ]
    },

    "product_card_blueprint": {
      "layout": "Image-first, minimal meta, wishlist heart top-right.",
      "tailwind": {
        "wrapper": "group rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] overflow-hidden",
        "image": "aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]",
        "meta": "p-4 sm:p-5",
        "title": "font-[var(--font-serif)] text-lg text-[color:var(--ink-1)]",
        "subtitle": "mt-1 text-xs tracking-wide uppercase text-[color:var(--ink-3)]",
        "price": "mt-3 text-sm font-medium text-[color:var(--ink-2)]"
      },
      "states": {
        "hover": "shadow lift + image zoom",
        "wishlist": "heart toggles filled terracotta; toast via sonner"
      },
      "required_data_testids": {
        "card": "product-card",
        "wishlist_button": "product-card-wishlist-button",
        "open_pdp": "product-card-open-link",
        "price": "product-card-price"
      }
    },

    "header_nav": {
      "pattern": "Museum-like top bar with subtle bottom border; mega menu optional later.",
      "tailwind": {
        "bar": "sticky top-0 z-40 backdrop-blur bg-[rgba(247,241,230,0.82)] border-b border-[color:var(--border-subtle)]",
        "inner": "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between",
        "logo": "font-[var(--font-serif)] text-xl tracking-tight text-[color:var(--ink-1)]",
        "link": "text-sm text-[color:var(--ink-2)] hover:text-[color:var(--ink-1)] transition-colors",
        "icon_button": "h-10 w-10 rounded-full hover:bg-[rgba(179,90,60,0.10)] transition-colors"
      },
      "required_data_testids": {
        "nav": "site-header",
        "wishlist": "header-wishlist-button",
        "cart": "header-cart-button",
        "account": "header-account-button",
        "mobile_menu": "header-mobile-menu-button"
      }
    },

    "filters_and_sort": {
      "collections_page": {
        "desktop": "Left filter column (sticky) + product grid right.",
        "mobile": "Use Drawer for filters; Select for sort.",
        "components": ["drawer", "checkbox", "slider", "select", "accordion"],
        "required_data_testids": {
          "open_filters": "collections-open-filters-button",
          "sort_select": "collections-sort-select",
          "filter_material": "collections-filter-material",
          "filter_price": "collections-filter-price"
        }
      }
    },

    "cart_drawer": {
      "component": "sheet",
      "pattern": "Right-side sheet with line-item cards, subtle separators, and a calm CTA.",
      "required_data_testids": {
        "open": "cart-open-drawer-button",
        "drawer": "cart-drawer",
        "checkout": "cart-drawer-checkout-button",
        "remove_item": "cart-drawer-remove-item-button",
        "qty_stepper": "cart-drawer-quantity-stepper"
      }
    },

    "forms": {
      "style": "Soft borders, warm surfaces, clear focus ring.",
      "tailwind": {
        "input": "bg-[color:var(--surface)] border border-[color:var(--border-subtle)] rounded-xl focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
        "label": "text-xs tracking-wide uppercase text-[color:var(--ink-3)]"
      },
      "required_data_testids": {
        "login_google": "login-google-button",
        "checkout_address": "checkout-address-form",
        "admin_login": "admin-login-form"
      }
    },

    "admin_ui": {
      "tone": "Same brand, slightly more utilitarian; keep warm background but increase density.",
      "components": ["table", "tabs", "dialog", "form", "input", "select", "textarea", "pagination"],
      "required_data_testids": {
        "admin_nav": "admin-sidebar",
        "admin_products": "admin-products-table",
        "admin_create_product": "admin-create-product-button"
      }
    }
  },

  "page_recipes": {
    "home": {
      "sections": [
        "Hero (split layout: manifesto + featured image)",
        "Sustainability Story (short paragraphs + material icons)",
        "Featured Collections (3 tiles, editorial captions)",
        "Craftsmanship Journey (7-step horizontal scroll on mobile)",
        "Featured Products (quiet grid)",
        "Artisan Stories (2-up portraits)",
        "Material Library (bento cards for terracotta/wood/bamboo/fabric/wool/cork)",
        "Why Gullak (3 principles)",
        "Testimonials (minimal quotes)",
        "Instagram Gallery (masonry)",
        "Newsletter (calm CTA)"
      ],
      "hero_tailwind": {
        "section": "grain-bg relative overflow-hidden",
        "bg": "bg-[color:var(--bg)]",
        "accent": "bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(179,90,60,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(143,165,142,0.16),transparent_60%)]"
      },
      "required_data_testids": {
        "hero_cta": "home-hero-shop-cta",
        "newsletter": "home-newsletter-form"
      }
    },

    "collection_listing": {
      "composition": [
        "Top editorial header (collection title + 2-line description)",
        "Sticky filter rail (desktop) / Drawer (mobile)",
        "Product grid: 2 cols mobile, 3 cols md, 4 cols xl",
        "Pagination at bottom"
      ],
      "required_data_testids": {
        "grid": "collections-product-grid",
        "pagination": "collections-pagination"
      }
    },

    "pdp": {
      "composition": [
        "Above the fold: large gallery left (or top on mobile) + buy box right",
        "Buy box includes: title, price, variant, add-to-cart, wishlist, shipping note",
        "Long-form story section with pull quote",
        "Details accordion: material, dimensions/weight, care guide, packaging",
        "Artisan profile card",
        "Pair-with carousel + recently viewed"
      ],
      "required_data_testids": {
        "add_to_cart": "pdp-add-to-cart-button",
        "wishlist": "pdp-wishlist-button",
        "variant": "pdp-variant-select",
        "gallery": "pdp-image-gallery",
        "price": "pdp-price"
      }
    },

    "journal": {
      "listing": "Magazine-like list: one featured article (large), then 2-column cards.",
      "article": "Wide hero image, serif title, drop cap optional, pull quotes, footnotes.",
      "required_data_testids": {
        "journal_grid": "journal-article-grid",
        "article_title": "journal-article-title"
      }
    },

    "checkout": {
      "composition": [
        "Two-column on desktop: form left, order summary right",
        "Mobile: summary collapsible at top",
        "Mock place order button leads to confirmation"
      ],
      "required_data_testids": {
        "place_order": "checkout-place-order-button",
        "order_summary": "checkout-order-summary"
      }
    }
  },

  "image_urls": {
    "hero_and_editorial": [
      {
        "url": "https://images.unsplash.com/photo-1571239127359-766e008befa1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Minimal botanical leaf on soft green background (use as subtle editorial hero side image / section divider).",
        "category": "home-hero / journal-hero"
      },
      {
        "url": "https://images.unsplash.com/photo-1583135989598-8bdd0af59cb0?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Glass vase with white flowers (calm studio still-life).",
        "category": "about / sustainability story"
      }
    ],
    "product_placeholders": [
      {
        "url": "https://images.unsplash.com/photo-1720686615374-ea04dac6a66e?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Minimal earrings on white cloth (use for product cards / PDP gallery).",
        "category": "product-grid / pdp-gallery"
      },
      {
        "url": "https://images.unsplash.com/photo-1593554466439-3c9978dd302c?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Ring on white textile (clean premium placeholder).",
        "category": "product-grid / pdp-gallery"
      },
      {
        "url": "https://images.unsplash.com/photo-1702476320482-0736c4b962f5?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Gold objects on white surface (use for collection hero / product detail alt).",
        "category": "collections / pdp-gallery"
      }
    ],
    "studio_craft": [
      {
        "url": "https://images.unsplash.com/photo-1525004482414-ef6d156fde79?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Studio tools by window (use for craftsmanship journey / artisan story).",
        "category": "craftsmanship / artisans"
      }
    ]
  },

  "accessibility": {
    "rules": [
      "WCAG AA contrast: charcoal text on ivory/sand; ivory text only on deep terracotta.",
      "Focus states: always visible (ring with terracotta tint).",
      "Hit targets: min 44px height for primary actions.",
      "Use semantic headings and landmarks; avoid text baked into images.",
      "Respect prefers-reduced-motion."
    ]
  },

  "instructions_to_main_agent": [
    "Update /app/frontend/src/App.css to remove CRA demo styles; do not center the app container.",
    "Update /app/frontend/src/index.css :root tokens to match the HSL mapping and add brand CSS vars (--ivory, --terracotta-deep, etc.).",
    "Add Google Fonts links in public/index.html for Cormorant Garamond + Manrope (+ optional Azeret Mono).",
    "Implement pages with mobile-first editorial spacing; avoid dense ecommerce UI.",
    "Use shadcn components from /app/frontend/src/components/ui only (no raw HTML dropdowns/calendars/toasts).",
    "All interactive and key informational elements MUST include data-testid attributes (kebab-case).",
    "Use sonner for toasts (wishlist added, cart updated, order placed).",
    "Avoid gradients except the hero wash; keep gradient area <=20% viewport."
  ],

  "general_ui_ux_design_guidelines": [
    "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms",
    "- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text",
    "- NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json",
    "\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n",
    "\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead.\n   ",
    "- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.",
    "\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   ",
    "- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n",
    "\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n",
    "\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n",
    "\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n",
    "\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n",
    "\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n",
    "\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
  ]
}
