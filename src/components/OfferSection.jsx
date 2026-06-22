import { offerItemsData } from '../data/index';

function OfferItem({ icon, name, price, tag }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 cursor-pointer group px-4 py-3 rounded-xl hover:bg-[#fff8f0] transition-all duration-200">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-[#fdfaf5] border border-[#f5e8d0] group-hover:border-[#f9bb5c] group-hover:scale-110 transition-all duration-200">
        {icon}
      </div>
      {tag && (
        <span className="text-[10px] font-bold text-[#c46206] border border-[#fcd9a0] px-2 py-0.5 rounded-full uppercase"
          style={{ background: '#fff8f0' }}>
          {tag}
        </span>
      )}
      <p className="text-xs font-semibold text-[#2d1a0e] leading-tight">{name}</p>
      <p className="text-sm font-bold text-[#e07c0a]">{price}</p>
    </div>
  );
}

export default function OfferSection() {
  return (
    <section className="py-12 bg-white" id="offer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="section-label">OFFER ZONE</p>
          <h2 className="section-title">Offer From Anywhere</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
            Send flowers, light a diya, and make a holy offering from your nearest to any temple — no matter where you are.
          </p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-6 flex-wrap">
          {offerItemsData.map((item) => (
            <OfferItem key={item.id} {...item} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="btn-primary px-8">Browse All Offerings</button>
        </div>
      </div>
    </section>
  );
}