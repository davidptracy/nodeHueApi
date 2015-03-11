// adapted for Arduino Yun by David P Tracy

// MPU-6050 Short Example Sketch
// By Arduino User JohnChi

// August 17, 2014
// Public Domain


#include <Bridge.h>
#include <Process.h>
#include<Wire.h>

Process node;

const int MPU=0x68;  // I2C address of the MPU-6050
int sensorVal = 50;
String message = "";
char sensorStr[3];

int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;

void setup(){
  //delay to prevent ATMEL chip from interrupting Linux load.
//  delay(90000);
  
  Bridge.begin();
  Serial.begin(9600); 
 
  pinMode(7, INPUT);
  
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);  
  
//  while(!Serial);
  
  // launch the echo.js script asynchronously:
  node.runShellCommandAsynchronously("killall nodejs");
  node.runShellCommandAsynchronously("killall node");
  delay(200);
  node.runShellCommandAsynchronously("node /mnt/sda1/arduino/node/conDevSocketClient.js");
  
}

void loop(){
  
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
  Wire.endTransmission(false);
  Wire.requestFrom(MPU,14,true);  // request a total of 14 registers
  AcX=Wire.read()<<8|Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)     
  AcY=Wire.read()<<8|Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
  AcZ=Wire.read()<<8|Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
  Tmp=Wire.read()<<8|Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
  GyX=Wire.read()<<8|Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
  GyY=Wire.read()<<8|Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
  GyZ=Wire.read()<<8|Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)
  
  
//  Serial.print("AcX = "); Serial.print(AcX);
//  Serial.print(" | AcY = "); Serial.print(AcY);
//  Serial.print(" | AcZ = "); Serial.println(AcZ);
//  Serial.print(" | Tmp = "); Serial.print(Tmp/340.00+36.53);  //equation for temperature in degrees C from datasheet
//  Serial.print(" | GyX = "); Serial.print(GyX);
//  Serial.print(" | GyY = "); Serial.print(GyY);
//  Serial.print(" | GyZ = "); Serial.println(GyZ);
//  delay(100);
  
  if (digitalRead(7) == HIGH){
    Serial.println("button pressed");
    int sensorReading = map( GyY, -32000, 32000, -5, 5 );
    sensorVal += sensorReading;
    sensorVal = constrain(sensorVal, 0, 100);
    
//    Serial.println(sensorVal);
    
    message = String(sensorVal);
    
    message.toCharArray(sensorStr, 3); 
      for( int i = 0; i < message.length(); ++i ) {
        node.write(message.charAt(i));
      }  
    node.write('\n');
  }
  
  while (node.available()) {
    char c = node.read();
    Serial.print(c);    
  }
  
  
}
