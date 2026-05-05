package kz.girls.shop.service;

import kz.girls.shop.dto.CartRequest;
import kz.girls.shop.entity.*;
import kz.girls.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<CartItem> getCart(String email) {
        return cartItemRepository.findByUser(getUser(email));
    }

    public CartItem addToCart(String email, CartRequest req) {
        User user = getUser(email);
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(req.getQuantity())
                .selectedSize(req.getSelectedSize())
                .build();
        return cartItemRepository.save(item);
    }

    public void removeFromCart(Long itemId, String email) {
        User user = getUser(email);
        cartItemRepository.deleteByIdAndUser(itemId, user);
    }
}
