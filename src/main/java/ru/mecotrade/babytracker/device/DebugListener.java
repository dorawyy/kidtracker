package ru.mecotrade.babytracker.device;

import lombok.extern.slf4j.Slf4j;
import ru.mecotrade.babytracker.exception.BabyTrackerException;

import java.io.DataOutputStream;
import java.net.Socket;

@Slf4j
public class DebugListener extends DeviceListener {

    public DebugListener(Socket socket) {
        super(socket);
    }

    @Override
    void process(byte[] data) throws BabyTrackerException {
        log.debug("[{}] ### {}", getId(), new String(data));
    }
}
