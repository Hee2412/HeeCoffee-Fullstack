import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import s from "../styles/Home.module.scss";

export default function HomePage() {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageCache = useRef({});

  const handleFilterChange = (typeId, page = 0) => {
    setSelectedType(typeId);
    setCurrentPage(page);

    const cacheKey = `${typeId}-${page}`;
    if (pageCache.current[cacheKey]) {
      setProducts(pageCache.current[cacheKey].content);
      setTotalPages(pageCache.current[cacheKey].totalPages);
      return;
    }

    const queryParams = new URLSearchParams();
    queryParams.append("typeId", typeId);
    queryParams.append("pageNumber", page);
    queryParams.append("pageSize", 12);

    fetch(`http://localhost:8080/api/product/filter?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((apiResponse) => {
        const resultData = apiResponse.data;

        if (resultData && !Array.isArray(resultData) && resultData.content) {
          setProducts(resultData.content);
          setTotalPages(resultData.totalPages);
          pageCache.current[cacheKey] = resultData;
        } else {
          setProducts([]);
          setTotalPages(0);
          pageCache.current[cacheKey] = { content: [], totalPages: 0 };
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    handleFilterChange(0);
    fetch("http://localhost:8080/api/type")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setTypes(data.data);
        } else {
          setTypes([]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className={s.homepage}>
      <h1>Coffee Drinks</h1>
      <div className={s.homepage_container}>
        {/* BÊN TRÁI */}
        <div className={s.homepage_left_panel}>
          <ProductFilter
            types={types}
            selected={selectedType}
            onChange={handleFilterChange}
          />
          <div className={s.homepage_banner}>
            <img src="/coffee/banner.jpg" alt="Coffee Banner" />
          </div>
        </div>

        {/* BÊN PHẢI */}
        <div className={s.homepage_right_panel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + selectedType} // đổi khi phân trang hoặc filter
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={s.homepage_product_grid} // giữ grid layout
            >
              {products.map((product) => (
                <div key={product.id} className={s.product_motion_wrapper}>
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className={s.pagination}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={currentPage === index ? s.active : ""}
            onClick={() => handleFilterChange(selectedType, index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
