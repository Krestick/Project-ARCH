package kz.girls.shop.dto;

import lombok.Data;

@Data
public class CartRequest {
    private Long productId;
    private Integer quantity;
    private String selectedSize;
}
