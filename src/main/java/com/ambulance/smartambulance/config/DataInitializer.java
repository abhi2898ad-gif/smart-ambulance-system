package com.ambulance.smartambulance.config;

import com.ambulance.smartambulance.entity.*;
import com.ambulance.smartambulance.entity.enums.*;
import com.ambulance.smartambulance.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final HospitalRepository hospitalRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final EmergencyRequestRepository emergencyRepository;
    private final TripRepository tripRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, DriverRepository driverRepository, HospitalRepository hospitalRepository, AmbulanceRepository ambulanceRepository, EmergencyRequestRepository emergencyRepository, TripRepository tripRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.hospitalRepository = hospitalRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.emergencyRepository = emergencyRepository;
        this.tripRepository = tripRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized. Skipping seed data.");
            return;
        }

        log.info("Seeding initial demo data for Smart Ambulance Dispatch System...");

        // 1. Seed Users (including frontend 1-click demo logins)
        User adminSmart = User.builder()
                .name("Super Administrator")
                .email("admin@smartambulance.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("+91-9876543200")
                .role(Role.ADMIN)
                .address("Central Command & Dispatch Center, Hyderabad")
                .build();
        userRepository.save(adminSmart);

        User userSmart = User.builder()
                .name("Demo Patient")
                .email("user@smartambulance.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("+91-9876543201")
                .role(Role.USER)
                .address("Road No 10, Banjara Hills, Hyderabad")
                .build();
        userRepository.save(userSmart);

        User hospitalSmart = User.builder()
                .name("Metro General Coordinator")
                .email("hospital@smartambulance.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("+91-9876543202")
                .role(Role.HOSPITAL)
                .address("Gachibowli, Hyderabad")
                .build();
        userRepository.save(hospitalSmart);

        User driverSmart = User.builder()
                .name("Rajesh Paramedic")
                .email("driver@smartambulance.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("+91-9876543203")
                .role(Role.DRIVER)
                .address("Ameerpet, Hyderabad")
                .build();
        userRepository.save(driverSmart);

        User admin = User.builder()
                .name("System Administrator")
                .email("admin@ambulance.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("+91-9876543210")
                .role(Role.ADMIN)
                .address("Control Command Center, Hyderabad")
                .build();
        userRepository.save(admin);

        User patient = User.builder()
                .name("Rahul Sharma")
                .email("patient@ambulance.com")
                .password(passwordEncoder.encode("patient123"))
                .phone("+91-9876543211")
                .role(Role.USER)
                .address("Road No 12, Banjara Hills, Hyderabad")
                .build();
        userRepository.save(patient);

        User hospitalUser = User.builder()
                .name("Apollo Emergency Coordinator")
                .email("apollo@hospital.com")
                .password(passwordEncoder.encode("hospital123"))
                .phone("+91-9876543212")
                .role(Role.HOSPITAL)
                .address("Jubilee Hills, Hyderabad")
                .build();
        userRepository.save(hospitalUser);

        User driverUser1 = User.builder()
                .name("Ramesh Kumar")
                .email("driver1@ambulance.com")
                .password(passwordEncoder.encode("driver123"))
                .phone("+91-9876543221")
                .role(Role.DRIVER)
                .address("Koti, Hyderabad")
                .build();
        userRepository.save(driverUser1);

        User driverUser2 = User.builder()
                .name("Suresh Reddy")
                .email("driver2@ambulance.com")
                .password(passwordEncoder.encode("driver123"))
                .phone("+91-9876543222")
                .role(Role.DRIVER)
                .address("Secunderabad, Hyderabad")
                .build();
        userRepository.save(driverUser2);

        User driverUser3 = User.builder()
                .name("Venkat Rao")
                .email("driver3@ambulance.com")
                .password(passwordEncoder.encode("driver123"))
                .phone("+91-9876543223")
                .role(Role.DRIVER)
                .address("Madhapur, Hitec City, Hyderabad")
                .build();
        userRepository.save(driverUser3);

        // 2. Seed Drivers
        Driver driver0 = Driver.builder()
                .user(driverSmart)
                .licenseNumber("TS09-DL-2021000")
                .phone(driverSmart.getPhone())
                .status(DriverStatus.AVAILABLE)
                .currentLatitude(17.4375)
                .currentLongitude(78.4482)
                .build();
        driverRepository.save(driver0);

        Driver driver1 = Driver.builder()
                .user(driverUser1)
                .licenseNumber("TS09-DL-2021001")
                .phone(driverUser1.getPhone())
                .status(DriverStatus.AVAILABLE)
                .currentLatitude(17.3850)
                .currentLongitude(78.4867)
                .build();
        driverRepository.save(driver1);

        Driver driver2 = Driver.builder()
                .user(driverUser2)
                .licenseNumber("TS09-DL-2021002")
                .phone(driverUser2.getPhone())
                .status(DriverStatus.AVAILABLE)
                .currentLatitude(17.4399)
                .currentLongitude(78.4983)
                .build();
        driverRepository.save(driver2);

        Driver driver3 = Driver.builder()
                .user(driverUser3)
                .licenseNumber("TS09-DL-2021003")
                .phone(driverUser3.getPhone())
                .status(DriverStatus.AVAILABLE)
                .currentLatitude(17.4435)
                .currentLongitude(78.3772)
                .build();
        driverRepository.save(driver3);

        // 3. Seed Hospitals
        Hospital hospital1 = Hospital.builder()
                .name("Apollo Hospital")
                .address("Road No 72, Film Nagar, Jubilee Hills, Hyderabad")
                .phone("040-23607777")
                .latitude(17.4325)
                .longitude(78.4071)
                .emergencyCapacity(20)
                .currentEmergencyCount(2)
                .status(HospitalStatus.READY)
                .build();
        hospitalRepository.save(hospital1);

        Hospital hospital2 = Hospital.builder()
                .name("Yashoda Hospital")
                .address("Raj Bhavan Road, Somajiguda, Hyderabad")
                .phone("040-45674567")
                .latitude(17.4262)
                .longitude(78.4590)
                .emergencyCapacity(15)
                .currentEmergencyCount(4)
                .status(HospitalStatus.READY)
                .build();
        hospitalRepository.save(hospital2);

        Hospital hospital3 = Hospital.builder()
                .name("CARE Hospitals")
                .address("Road No 1, Banjara Hills, Hyderabad")
                .phone("040-30418888")
                .latitude(17.4156)
                .longitude(78.4487)
                .emergencyCapacity(18)
                .currentEmergencyCount(5)
                .status(HospitalStatus.READY)
                .build();
        hospitalRepository.save(hospital3);

        // 4. Seed Ambulances with diverse statuses
        Ambulance amb1 = Ambulance.builder()
                .ambulanceNumber("TS09-AMB-101")
                .ambulanceType(AmbulanceType.ICU)
                .status(AmbulanceStatus.AVAILABLE)
                .latitude(17.3850)
                .longitude(78.4867)
                .driver(driver1)
                .hospital(hospital1)
                .build();
        ambulanceRepository.save(amb1);

        Ambulance amb2 = Ambulance.builder()
                .ambulanceNumber("TS09-AMB-102")
                .ambulanceType(AmbulanceType.ADVANCED)
                .status(AmbulanceStatus.AVAILABLE)
                .latitude(17.4399)
                .longitude(78.4983)
                .driver(driver2)
                .hospital(hospital2)
                .build();
        ambulanceRepository.save(amb2);

        Ambulance amb3 = Ambulance.builder()
                .ambulanceNumber("TS09-AMB-103")
                .ambulanceType(AmbulanceType.BASIC)
                .status(AmbulanceStatus.AVAILABLE)
                .latitude(17.4435)
                .longitude(78.3772)
                .driver(driver3)
                .hospital(hospital3)
                .build();
        ambulanceRepository.save(amb3);

        Ambulance amb4 = Ambulance.builder()
                .ambulanceNumber("TS09-AMB-104")
                .ambulanceType(AmbulanceType.ADVANCED)
                .status(AmbulanceStatus.AVAILABLE)
                .latitude(17.4325)
                .longitude(78.4071)
                .driver(driver0)
                .hospital(hospital1)
                .build();
        ambulanceRepository.save(amb4);

        Ambulance amb5 = Ambulance.builder()
                .ambulanceNumber("TS09-AMB-105")
                .ambulanceType(AmbulanceType.ADVANCED)
                .status(AmbulanceStatus.MAINTENANCE)
                .latitude(17.4262)
                .longitude(78.4590)
                .driver(null)
                .hospital(hospital2)
                .build();
        ambulanceRepository.save(amb5);

        // 5. Seed Historical Emergency & Completed Trip
        EmergencyRequest historicalEmergency = EmergencyRequest.builder()
                .user(patient)
                .emergencyType("CARDIAC")
                .description("Patient experiencing acute chest pain in Banjara Hills")
                .severity("CRITICAL")
                .priority(EmergencyPriority.CRITICAL)
                .latitude(17.4156)
                .longitude(78.4487)
                .status(EmergencyStatus.COMPLETED)
                .ambulance(amb1)
                .hospital(hospital3)
                .requestedAt(LocalDateTime.now().minusHours(2))
                .assignedAt(LocalDateTime.now().minusHours(2).plusMinutes(2))
                .completedAt(LocalDateTime.now().minusHours(1))
                .estimatedArrivalTime(LocalDateTime.now().minusHours(2).plusMinutes(12))
                .build();
        emergencyRepository.save(historicalEmergency);

        Trip historicalTrip = Trip.builder()
                .emergency(historicalEmergency)
                .ambulance(amb1)
                .driver(driver1)
                .startTime(LocalDateTime.now().minusHours(2).plusMinutes(3))
                .endTime(LocalDateTime.now().minusHours(1))
                .distance(4.5)
                .duration(57L)
                .status(TripStatus.COMPLETED)
                .build();
        tripRepository.save(historicalTrip);

        log.info("Demo data seeding completed successfully!");
    }
}
