import Image, { ImageProps } from "next/image";

const PromoBanner = (props: ImageProps) => {
  return (
    <Image
      width={0}
      height={0}
      className="h-auto w-full"
      sizes="100vw"
      quality={100}
      {...props}
    />
  );
};

export default PromoBanner;
