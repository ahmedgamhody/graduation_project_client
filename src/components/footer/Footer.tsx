import logo from "../../../public/main_logo_gray.png";

const Footer = () => {
  return (
    <section className="bg-[#E9E9E9] text-[#767676] py-6">
      <div className="container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-xl font-semibold text-[#4E4FEB]">EGYPT GUIDE</h2>
        </div>
        <p className="mt-2 text-sm md:mt-0">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
