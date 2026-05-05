package kz.girls.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String name;
    private BigDecimal price;
    private String image;
    private String category;
    private Integer quantity;
    private String selectedSize;
}
