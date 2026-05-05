package kz.girls.shop.controller;

import kz.girls.shop.entity.Category;
import kz.girls.shop.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @PostMapping
    public ResponseEntity<Category> create(@RequestParam String name) {
        return ResponseEntity.ok(categoryService.create(name));
    }
}