package kz.girls.shop.service;

import kz.girls.shop.entity.*;
import kz.girls.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Order createOrder(String email) {
        User user = getUser(email);
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty())
            throw new RuntimeException("Cart is empty");

        BigDecimal total = cartItems.stream()
                .map(i -> i.getProduct().getPrice()
                        .multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderItem> orderItems = cartItems.stream().map(ci ->
                OrderItem.builder()
                        .product(ci.getProduct())
                        .quantity(ci.getQuantity())
                        .price(ci.getProduct().getPrice())
                        .build()
        ).collect(Collectors.toList());

        Order order = Order.builder()
                .user(user)
                .items(orderItems)
                .totalPrice(total)
                .status("PENDING")
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        Order saved = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);
        return saved;
    }

    public List<Order> getOrders(String email) {
        return orderRepository.findByUser(getUser(email));
    }
}
