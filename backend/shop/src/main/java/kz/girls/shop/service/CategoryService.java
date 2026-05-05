package kz.girls.shop.service;

import kz.girls.shop.entity.Category;
import kz.girls.shop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category create(String name) {
        if (categoryRepository.existsByName(name))
            throw new RuntimeException("Category already exists");
        return categoryRepository.save(Category.builder().name(name).build());
    }
}
