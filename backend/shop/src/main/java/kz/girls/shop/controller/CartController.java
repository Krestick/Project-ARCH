package kz.girls.shop.controller;

import kz.girls.shop.dto.CartItemResponse;
import kz.girls.shop.dto.CartRequest;
import kz.girls.shop.entity.CartItem;
import kz.girls.shop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public List<CartItemResponse> getCart(@AuthenticationPrincipal UserDetails user) {
        return cartService.getCart(user.getUsername()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> add(@AuthenticationPrincipal UserDetails user,
                                                @RequestBody CartRequest req) {
        CartItem item = cartService.addToCart(user.getUsername(), req);
        return ResponseEntity.ok(toResponse(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id,
                                    @AuthenticationPrincipal UserDetails user) {
        cartService.removeFromCart(id, user.getUsername());
        return ResponseEntity.ok(java.util.Map.of("message", "Removed"));
    }

    private CartItemResponse toResponse(CartItem item) {
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getPrice(),
                item.getProduct().getImage(),
                item.getProduct().getCategory() != null ? item.getProduct().getCategory().getName() : null,
                item.getQuantity(),
                item.getSelectedSize()
        );
    }
}

