import React from 'react';

export type ImageProps = any;

const Image = (props: ImageProps) => {
  const {
    src,
    alt,
    width,
    height,
    fill,
    className,
    style,
    priority,
    quality,
    placeholder,
    blurDataURL,
    loader,
    unoptimized,
    sizes,
    ...rest
  } = props;
  const resolvedSrc = typeof src === 'string' ? src : src?.src;
  const fillStyle = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: style?.objectFit || 'cover' }
    : undefined;
  return (
    <img
      src={resolvedSrc}
      alt={alt || ''}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={fill ? { ...fillStyle, ...style } : style}
      {...rest}
    />
  );
};

export default Image;
export const getImageProps = (props: any) => ({ props: { src: typeof props.src === 'string' ? props.src : props.src?.src } });
