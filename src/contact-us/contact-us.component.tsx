import { EnvelopeOpenIcon, MapPinIcon } from "@heroicons/react/24/outline";

// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   viewBox="0 0 24 24"
//   fill="currentColor"
//   class="size-6"
// >
//   <path
//     fill-rule="evenodd"
//     d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z"
//     clip-rule="evenodd"
//   />
// </svg>;

const ContactUs = () => {
  return (
    <div className="h-[100%] pb-10">
      <div className="m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] w-[80%] md:w-[50%] mb-5 mt-[100px]">
        <div className="flex m-auto">
          <section className="py-10 px-5 w-[100%]">
            <div className="flex w-[100%] m-auto justify-around text-base md:text-xl lg:text-2xl sm:flex-row items-center">
              <div className="px-3 md:p-0 m-auto">
                <MapPinIcon className="h-8 w-8 text-[#B22222]" />
              </div>
              <div className="basis-5/6 my1-3 border1-spacing-3 text-base md:text-xl lg:text-2xl">
                <p className="m-auto">Secretary</p>
                <p className="m-auto">Sri Lanka Society of Queensland Inc.</p>
                <p className="m-auto">PO Box 15099,</p>
                <p className="m-auto">CITY EAST QLD 4002.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-[100%] m-auto justify-around text-base md:text-xl lg:text-2xl sm:flex1-row items-center">
              <div className="px-3 p-3 md:p-0 m-auto">
                <EnvelopeOpenIcon className="h-8 w-8 text-[#B22222]" />
              </div>
              <div className="basis-5/6 my-3">
                <div className="m-auto">secretary&#64;srilankansqld.org</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
