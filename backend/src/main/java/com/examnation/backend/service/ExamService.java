package com.examnation.backend.service;

import com.examnation.backend.exception.ResourceNotFoundException;
import com.examnation.backend.model.PastExam;
import com.examnation.backend.repository.PastExamRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Year;
import java.util.List;

@Service
public class ExamService {

    private final PastExamRepository pastExamRepository;
    private final FileStorageService fileStorageService;

    public ExamService(PastExamRepository pastExamRepository, FileStorageService fileStorageService) {
        this.pastExamRepository = pastExamRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<PastExam> getAllPastExams() {
        return pastExamRepository.findAll();
    }

    public PastExam getPastExamById(Long id) {
        return pastExamRepository.findById(id).orElse(null);
    }

    public List<PastExam> getPastExamsBySubject(String subject) {
        return pastExamRepository.findBySubject(subject);
    }

    public List<PastExam> getPastExamsBySubjectAndLevel(String subject, String level) {
        return pastExamRepository.findBySubjectAndLevel(subject, level);
    }

    public PastExam savePastExam(PastExam pastExam) {
        return pastExamRepository.save(pastExam);
    }

    public PastExam savePastExamWithFile(String title, String subject, String level, String year, MultipartFile file) throws IOException {
        String stored = fileStorageService.storeFile(file);
        PastExam exam = new PastExam();
        exam.setTitle(title);
        exam.setSubject(subject);
        exam.setLevel(level);
        exam.setYear(parseYear(year));
        exam.setFilePath(stored);
        exam.setFileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        return pastExamRepository.save(exam);
    }

    public PastExam updatePastExam(Long id, PastExam incoming) {
        PastExam existing = pastExamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PastExam", "id", id));
        existing.setTitle(incoming.getTitle());
        existing.setSubject(incoming.getSubject());
        existing.setLevel(incoming.getLevel());
        existing.setYear(incoming.getYear());
        existing.setFilePath(incoming.getFilePath());
        existing.setFileType(incoming.getFileType());
        return pastExamRepository.save(existing);
    }

    public PastExam updatePastExamWithFile(Long id, String title, String subject, String level, String year,
                                           MultipartFile file) throws IOException {
        PastExam existing = pastExamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PastExam", "id", id));
        existing.setTitle(title);
        existing.setSubject(subject);
        existing.setLevel(level);
        existing.setYear(parseYear(year));

        if (file != null && !file.isEmpty()) {
            // delete old if exists
            if (existing.getFilePath() != null) {
                fileStorageService.deleteFile(existing.getFilePath());
            }
            String stored = fileStorageService.storeFile(file);
            existing.setFilePath(stored);
            existing.setFileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        }
        return pastExamRepository.save(existing);
    }

    private Year parseYear(String year) {
        try {
            return Year.parse(year);
        } catch (Exception e) {
            return Year.of(Integer.parseInt(year));
        }
    }

    public void deletePastExam(Long id) {
        pastExamRepository.deleteById(id);
    }
}