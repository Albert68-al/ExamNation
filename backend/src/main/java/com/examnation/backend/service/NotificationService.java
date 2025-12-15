package com.examnation.backend.service;

import com.examnation.backend.exception.ResourceNotFoundException;
import com.examnation.backend.model.Notification;
import com.examnation.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public Notification updateNotification(Long id, Notification incoming) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        existing.setUserId(incoming.getUserId());
        existing.setMessage(incoming.getMessage());
        existing.setRead(incoming.isRead());
        return notificationRepository.save(existing);
    }
}