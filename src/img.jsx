// Fotografia responsiva: versões 1100w e 2400w em /img
export default function Img({ name, alt, sizes = '100vw', className, eager, ...rest }) {
  return (
    <img
      src={`/img/${name}.webp`}
      srcSet={`/img/${name}-m.webp 1100w, /img/${name}.webp 2400w`}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...rest}
    />
  )
}
