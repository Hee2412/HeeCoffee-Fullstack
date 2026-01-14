package com.example.heecoffee.Repository;

import com.example.heecoffee.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

    List<Product> findByStatus(Product.ProductStatus status);

    Optional<Product> findByIdAndStatus(Integer id, Product.ProductStatus status);

}
