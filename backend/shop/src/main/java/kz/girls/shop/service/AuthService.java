package kz.girls.shop.service;

import kz.girls.shop.dto.*;
import kz.girls.shop.entity.*;
import kz.girls.shop.repository.UserRepository;
import kz.girls.shop.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already exists");
        if (userRepository.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already exists");

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.CLIENT)
                .build();
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        String token = jwtUtil.generateToken(user.getEmail());
        UserDto userDto = new UserDto(user.getId(), user.getUsername(),
                user.getEmail(), user.getRole().name().toLowerCase());

        return new AuthResponse(token, userDto);
    }
}
