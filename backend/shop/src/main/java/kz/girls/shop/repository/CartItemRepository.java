package kz.girls.shop.repository;

import kz.girls.shop.entity.CartItem;
import kz.girls.shop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    void deleteByIdAndUser(Long id, User user);
}