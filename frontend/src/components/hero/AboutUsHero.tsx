import aboutUsImg from '@/assets/images/hero-sky.jpg';

const AboutUsHero = () => {
  return (
    <div className="relative w-full md:h-[500px]">
      <img
        src={aboutUsImg}
        alt="About Us"
        className="w-full h-full object-cover"
      />
      <h1 className="absolute top-8 left-1/2 transform -translate-x-1/2 text-4xl font-bold">
        About Us
      </h1>
    </div>
  );
};

export default AboutUsHero;