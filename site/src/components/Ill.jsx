// Recolorable illustration. Uses the SVG as a CSS mask + currentColor fill, so the
// same silhouette paints in whatever brand color the section sets via `color`.
export default function Ill({ src, w, h, className, style }) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width: w,
        height: h,
        backgroundColor: 'currentColor',
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        ...style,
      }}
    />
  )
}
