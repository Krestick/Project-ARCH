package kz.girls.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @NotBlank
    private String name;
    @NotNull @Positive
    private BigDecimal price;
    private String description;
    private String image;
    @NotBlank
    private String category;
    private List<String> sizes;
}