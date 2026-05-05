package kz.girls.shop.controller;

import kz.girls.shop.entity.Order;
import kz.girls.shop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> create(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.createOrder(user.getUsername()));
    }

    @GetMapping
    public List<Order> getOrders(@AuthenticationPrincipal UserDetails user) {
        return orderService.getOrders(user.getUsername());
    }
}