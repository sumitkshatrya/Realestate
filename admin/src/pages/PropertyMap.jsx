import { motion as Motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";

const listings = [
  ["Villa with Amazing View", "Downtown, Las Vegas", 36.1716, -115.1391],
  ["Townhouse for Sale", "Meadows Village, Las Vegas", 36.1699, -115.1398],
  ["Duplex sea facing for rent", "DC townhall, New York", 40.7128, -74.006],
  ["Villa with Side View", "Underground street, Houston", 29.7604, -95.3698],
  ["Awesome villa for rent", "Rubari, London", 51.5074, -0.1278],
  ["Street Farm for sale", "Northern district, Toronto", 43.6532, -79.3832],
];

const PropertyMap = () => (
  <div className="space-y-6">
    <Motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-red-300/75">Location directory</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Property map</h1>
      <p className="mt-2 text-sm leading-7 text-slate-300">Review the published location for every property type shown on the customer website.</p>
    </Motion.section>
    <div className="grid gap-4 md:grid-cols-2">
      {listings.map(([name, address, latitude, longitude], index) => {
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.08}%2C${latitude - 0.05}%2C${longitude + 0.08}%2C${latitude + 0.05}&layer=mapnik&marker=${latitude}%2C${longitude}`;
        return <Motion.article key={name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75">
          <iframe title={`Map showing ${name}`} src={mapUrl} className="h-52 w-full border-0" loading="lazy" />
          <div className="flex items-center justify-between gap-4 p-5"><div><h2 className="font-semibold text-white">{name}</h2><p className="mt-1 text-sm text-slate-400"><FaMapMarkerAlt className="mr-1 inline text-red-300" />{address}</p></div><a href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=14/${latitude}/${longitude}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-red-300 hover:text-white">Open</a></div>
        </Motion.article>;
      })}
    </div>
  </div>
);

export default PropertyMap;
