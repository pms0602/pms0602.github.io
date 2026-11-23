---
layout: post
title: "아두이노 RFID UID 인식기 - 등록된 카드인지 확인하는 인증 시스템"
date: 2026-11-23 13:20:00 +0900
categories: [개발]
tags: [Arduino, RFID, RC522, UID, 임베디드, 하드웨어]
---

## 1. 프로젝트 소개

아두이노 UNO 보드와 RFID-RC522 모듈을 활용해 특정 RFID 카드의 UID를 인식하고, 사전에 등록된 카드인지 확인하는 프로그램을 제작했다.

RFID는 무선 주파수를 이용해 태그에 저장된 정보를 인식하는 기술이다. 이번 프로젝트에서는 RFID 카드를 리더기에 가까이 가져가면 카드의 고유 식별 번호인 UID를 읽어오고, 해당 UID가 미리 등록된 정보와 일치하는지 확인하도록 구현했다.

단순히 카드를 인식하는 것에서 나아가, 등록된 사용자와 등록되지 않은 사용자를 구분하는 간단한 인증 시스템을 만드는 것이 목표였다.

## 2. 개발 환경

- **보드:** Arduino UNO
- **RFID 모듈:** MFRC522(RC522)
- **개발 환경:** Arduino IDE
- **통신 방식:** SPI

## 3. 주요 기능

### 3-1. RFID 카드 UID 인식

RFID 카드를 RC522 모듈에 가까이 가져가면 모듈이 카드의 UID를 읽어온다.

UID(Unique Identifier)는 각 RFID 카드에 부여된 고유 식별 번호다. 프로그램에서는 이 값을 이용해 어떤 카드가 인식되었는지 구분한다.

### 3-2. 등록된 UID 확인

프로그램 내부에 사전에 등록해 둔 UID 목록을 저장하고, 새롭게 인식된 카드의 UID와 비교하도록 구성했다.

카드가 인식되면 읽어온 UID가 등록된 목록에 존재하는지 확인한다. 이를 통해 등록 여부를 판별할 수 있도록 했다.

### 3-3. 등록 여부에 따른 결과 출력

UID 비교 결과에 따라 시리얼 모니터에 서로 다른 메시지가 출력된다.

- **등록된 카드:** 해당 UID에 연결된 등록 정보 출력
- **등록되지 않은 카드:** `미등록` 메시지 출력

이를 통해 카드를 인식하는 과정과 등록 정보를 확인하는 과정을 하나의 프로그램으로 구현했다.

## 4. 예시 코드

다음은 RFID 카드의 UID를 읽고, 사전에 등록된 UID 목록과 비교하는 예시 코드다.

```cpp
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

// 등록된 UID 목록
byte registeredUID[][4] = {
  {0xA1, 0xB2, 0xC3, 0xD4},
  {0x11, 0x22, 0x33, 0x44}
};

// UID에 연결된 등록 정보
const char* userInfo[] = {
  "등록 사용자 1",
  "등록 사용자 2"
};

const int userCount =
  sizeof(registeredUID) / sizeof(registeredUID[0]);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();

  Serial.println("RFID 리더기 초기화 완료");
  Serial.println("카드를 태그해주세요.");
}

void loop() {
  // 카드가 인식되지 않으면 대기
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  bool isRegistered = false;

  // 인식된 UID 출력
  Serial.print("인식된 UID: ");

  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i], HEX);
    Serial.print(" ");
  }
  Serial.println();

  // 등록된 UID와 비교
  for (int i = 0; i < userCount; i++) {
    bool match = true;

    for (byte j = 0; j < 4; j++) {
      if (rfid.uid.uidByte[j] != registeredUID[i][j]) {
        match = false;
        break;
      }
    }

    if (match && rfid.uid.size == 4) {
      Serial.print("등록된 사용자: ");
      Serial.println(userInfo[i]);
      isRegistered = true;
      break;
    }
  }

  // 등록 여부 출력
  if (!isRegistered) {
    Serial.println("미등록");
  }

  Serial.println("--------------------");

  // 카드 통신 종료
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
```

### 4-1. 코드 주요 부분 설명

| 코드 | 역할 |
|---|---|
| `SPI.begin()` | RC522와 통신하기 위한 SPI 초기화 |
| `rfid.PCD_Init()` | RFID 리더기 초기화 |
| `PICC_IsNewCardPresent()` | 새로운 카드가 감지되었는지 확인 |
| `PICC_ReadCardSerial()` | 카드의 UID 읽기 |
| `registeredUID` | 사전에 등록한 UID 목록 |
| `userInfo` | UID에 연결된 등록 정보 |
| `PICC_HaltA()` | 카드 통신 종료 |

### 4-2. UID 등록 방식

`registeredUID` 배열에 등록하고 싶은 카드의 UID를 추가하면 된다.

```cpp
byte registeredUID[][4] = {
  {0xA1, 0xB2, 0xC3, 0xD4},
  {0x11, 0x22, 0x33, 0x44}
};
```

각 UID는 16진수 형태로 저장하며, 새로운 카드를 등록하려면 해당 카드의 UID를 확인한 뒤 배열에 추가하면 된다.

위 코드는 4바이트 UID를 기준으로 작성한 예시다.

## 5. 실행 결과

등록된 카드가 인식되면 시리얼 모니터에 UID와 해당 카드의 등록 정보가 출력된다.

**등록된 카드**

```text
RFID 리더기 초기화 완료
카드를 태그해주세요.

인식된 UID: A1 B2 C3 D4
등록된 사용자: 등록 사용자 1
--------------------
```

**등록되지 않은 카드**

```text
인식된 UID: 55 66 77 88
미등록
--------------------
```

이처럼 카드의 UID를 비교해 등록 여부를 구분하고, 결과를 시리얼 모니터에서 확인할 수 있다.

## 6. 마무리

이번 프로젝트에서는 아두이노 UNO와 RFID-RC522 모듈을 활용해 카드의 UID를 읽고, 사전에 등록된 정보와 비교하는 간단한 인증 시스템을 구현했다.

RFID 모듈을 통해 외부 장치의 데이터를 읽어오는 과정부터 UID를 비교하고 결과를 출력하는 과정까지 경험할 수 있었다.

특히 하드웨어를 통해 입력받은 정보를 소프트웨어에서 처리하고, 그 결과에 따라 서로 다른 동작을 수행하도록 구성했다는 점에서 의미가 있었다.
