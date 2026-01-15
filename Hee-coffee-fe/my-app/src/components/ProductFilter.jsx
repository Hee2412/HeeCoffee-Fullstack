import s from "../styles/Filter.module.scss";
import { ChevronRight } from "lucide-react";
import startCase from "lodash/startCase";
export default function ProductFilter({ types, selected, onChange }) {
  // Add "All" option to types from backend
  const allTypes = [
    { id: 0, types: "All" }, // Match backend TypeResponse format
    ...types,
  ];

  

  return (
    <div className={s.product_filter}>
      {allTypes.map((type) => (
        <button
          key={type.id}
          className={selected === type.id ? "active" : ""}
          onClick={() => onChange(type.id)}
        >
          <span>{startCase(type.types)}</span>
          <ChevronRight className="arrow" size={18} />
        </button>
      ))}
    </div>
  );
}
