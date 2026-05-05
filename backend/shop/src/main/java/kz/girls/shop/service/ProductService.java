package kz.girls.shop.service;

import kz.girls.shop.dto.ProductRequest;
import kz.girls.shop.entity.*;
import kz.girls.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product create(ProductRequest req) {
        Category category = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals(req.getCategory()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = Product.builder()
                .name(req.getName())
                .price(req.getPrice())
                .description(req.getDescription())
                .image(req.getImage())
                .sizes(req.getSizes())
                .category(category)
                .build();
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest req) {
        Product product = getById(id);
        Category category = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals(req.getCategory()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(req.getName());
        product.setPrice(req.getPrice());
        product.setDescription(req.getDescription());
        product.setImage(req.getImage());
        product.setSizes(req.getSizes());
        product.setCategory(category);
        return productRepository.save(product);
    }

    public void delete(Long id) {

        cartItemRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }
}