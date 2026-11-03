// Attributes Fluid's markup and scripts use that are not standard HTML.
declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    /** The banner scrolls with a parallax effect. */
    parallax?: string;
    /** img-lazyload.js swaps the placeholder `srcset` for the real image. */
    lazyload?: '';
  }
  interface TimeHTMLAttributes {
    pubdate?: boolean;
  }
}
