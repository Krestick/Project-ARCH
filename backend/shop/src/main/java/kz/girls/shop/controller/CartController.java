package kz.girls.shop.controller;

import kz.girls.shop.dto.CartItemResponse;
import kz.girls.shop.dto.CartRequest;
import kz.girls.shop.dto.UpdateQuantityRequest;
import kz.girls.shop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public List<CartItemResponse> getCart(@AuthenticationPrincipal UserDetails user) {
        return cartService.getCart(user.getUsername());
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> add(@AuthenticationPrincipal UserDetails user,
                                                @RequestBody CartRequest req) {
        return ResponseEntity.ok(cartService.addToCart(user.getUsername(), req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemResponse> updateQuantity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user,
            @RequestBody UpdateQuantityRequest req) {
        return ResponseEntity.ok(cartService.updateQuantity(id, user.getUsername(), req.getQuantity()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id,
                                    @AuthenticationPrincipal UserDetails user) {
        cartService.removeFromCart(id, user.getUsername());
        return ResponseEntity.ok(java.util.Map.of("message", "Removed"));
    }
}
