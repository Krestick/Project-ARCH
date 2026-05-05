package kz.girls.shop.repository;

import kz.girls.shop.entity.Order;
import kz.girls.shop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}