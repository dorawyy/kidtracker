package ru.mecotrade.kidtracker.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.mecotrade.kidtracker.controller.model.Kid;
import ru.mecotrade.kidtracker.controller.model.Position;
import ru.mecotrade.kidtracker.controller.model.User;
import ru.mecotrade.kidtracker.dao.UserService;
import ru.mecotrade.kidtracker.processor.PositionProcessor;

import java.util.Collection;
import java.util.stream.Collectors;

@Controller
@Slf4j
@RequestMapping("/api/user/{userId}")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PositionProcessor positionProcessor;

    @GetMapping("/info")
    @ResponseBody
    public User info(@PathVariable Long userId) {
        // TODO: user not found
        return userService.get(userId).map(u -> new User(u.getName())).get();
    }

    @GetMapping("/kids/info")
    @ResponseBody
    public Collection<Kid> kidInfo(@PathVariable Long userId) {
        // TODO: user not found
        return userService.get(userId).get().getKids().stream().map(k -> new Kid(k.getDeviceId(), k.getName(), k.getThumb())).collect(Collectors.toList());
    }

    @GetMapping("/kids/position")
    @ResponseBody
    public Collection<Position> kidPositions(@PathVariable Long userId) {
        return positionProcessor.kidPositions(userId);
    }
}