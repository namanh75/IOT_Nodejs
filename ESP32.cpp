#include <WiFi.h>
#include <Wire.h>
#include <DHT.h>
#include <PubSubClient.h>
#include <Arduino_JSON.h>
#include <Adafruit_Sensor.h>
#include <LiquidCrystal_I2C.h>
#include <SPI.h>
#include <MFRC522.h>
#include <math.h>

/**************** Danh sách hằng số ******************/
#define DHT_TYPE DHT11
#define LCD_HEIGHT 4
#define LCD_WIDTH 20
#define LCD_ADDR 0x27

const char *broker = "broker.hivemq.com"; // dia chi broker
const int port = 1883;                    // port broker
const char *ssid = "linksys";             // ten wifi
const char *password = "";                // pass wifi
const int baudrate = 9600;                // Serial baudrate
const String idDevice = "NV001";

/****************   Danh sach chan  ******************/
#define DHT_PIN 14
#define MQ3_GAS 35
#define FIRE_PIN 34
#define ALERT_PIN 27
#define NORMAL_PIN 26
#define ERR_PIN 25
#define BUZZER_PIN 5

/****************   Danh sach tham so  ***************/
float temp, humid;
int fire, gas;
int hasFire, hasGas;
String warn;
String warn2;
String isOn;

/****************   Danh sach TOPIC   ***************/
const char *dataTopic = "/team15/messages";       // gui du lieu len server
const char *commandTopic = "/team15/controll"; // nhan lenh tu server
const char *stateTopic = "state";     // gui trang thai len server

/************ Khoi tao cau truc du lieu *************/
DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient wifiClient;
PubSubClient client(wifiClient);
LiquidCrystal_I2C lcd(LCD_ADDR, LCD_WIDTH, LCD_HEIGHT);

/****************   connect to wifi   ***************/
void connect_wifi()
{
   lcd.clear();
   lcd.setCursor(0, 1);
   lcd.print("Connecting to Wifi");
   lcd.setCursor(8, 2);
   lcd.print("...");

   while (WiFi.status() != WL_CONNECTED)
   {
      delay(500);
      Serial.println("Connecting to WiFi..");
   }
   Serial.println("Connected to the WiFi network");
   Serial.println("IP address: ");
   Serial.println(WiFi.localIP());

   lcd.clear();
   lcd.setCursor(0, 1);
   lcd.print("Connected to Wifi!");
   lcd.setCursor(5, 2);
   lcd.print(ssid);
   Serial.print("Connected to Wifi ");
   Serial.println(ssid);
   delay(1000);
}

/****************   connect to broker ***************/
void connect_broker()
{
   // Hiển thị thông báo
   lcd.clear();
   lcd.setCursor(0, 1);
   lcd.print("Connecting to Broker");
   lcd.setCursor(8, 2);
   lcd.print("...");

   while (!client.connected())
   {
      String clientId = "ESP32";
      clientId += String(random(0xffff), HEX);
      if (client.connect(clientId.c_str()))
      {
         // ket noi thanh cong
         Serial.println("Successfuly connecting to Broker");
         lcd.clear();
         lcd.setCursor(0, 1);
         lcd.print("Connected to Broker");
         delay(1000);
      }
      else
      {
         Serial.print("failed, rc=");
         Serial.print(client.state());

         lcd.clear();
         lcd.setCursor(0, 1);
         lcd.print("Error!!!");
         lcd.setCursor(0, 2);
         lcd.print("Try again in 5s ...");

         delay(5000);
      }
   }
   // subscribe de nhan tin hieu dieu khien tu server
   client.subscribe(commandTopic);
}

void callback(char *topic, byte *payload, unsigned int length)
{
   Serial.print("New message from topic: ");
   Serial.println(topic);
   for (int i = 0; i < length; i++)
   {
      Serial.print((char)payload[i]);
   }
   Serial.println();

   if ((String)topic == commandTopic)
   {
      JSONVar command = JSON.parse((String)((const char *)payload));

      // kiem tra id thiet bi
      if ((String)((const char *)command["idDivice"]) == idDevice)
      {
         Serial.println("Right ID");
         // Tín hiệu nhận được là tín hiệu điều khiển
         if ((String)(const char *)command["on"] == "true")
         {
            isOn = "on";
            lcd.clear();
            lcd.setCursor(3, 1);
            lcd.print("System is ON!");
            lcd.setCursor(4, 2);
         }
         else
         {
            isOn = "off";
            lcd.clear();
            lcd.setCursor(3, 1);
            lcd.print("System is OFF!");
         }
      }
   }
}

/*************** convert 0-3.3V 12bit -> 0.5V 10bit ***************/
int convert(int a)
{
   return (int)(a / 4096.0 * 3.3 / 5.0 * 1024.0);
}

/*************** Doi mau led ************************/
void changeLedState(String state)
{
   if (state == "red")
   {
      digitalWrite(ALERT_PIN, HIGH);
      digitalWrite(NORMAL_PIN, LOW);
      digitalWrite(ERR_PIN, LOW);
   }

   if (state == "green")
   {
      digitalWrite(ALERT_PIN, LOW);
      digitalWrite(NORMAL_PIN, HIGH);
      digitalWrite(ERR_PIN, LOW);
   }

   if (state == "blue")
   {
      digitalWrite(ALERT_PIN, LOW);
      digitalWrite(NORMAL_PIN, LOW);
      digitalWrite(ERR_PIN, HIGH);
   }
}
/*************** Doc the RFID **************************/

/***************  convert to json **********************/

/***************  LCD hien thi   **********************/
void displayInfo(float temp, float humi)
{
   lcd.clear();
   lcd.setCursor(0, 0);
   lcd.print("Temp(C): ");
   lcd.setCursor(0, 1);
   lcd.print("Humi(%): ");
   lcd.setCursor(0, 2);
   lcd.print("Fire: ");
   lcd.setCursor(10, 2);
   lcd.print("Gas: ");
   lcd.setCursor(0, 3);
   lcd.print("Danger: ");

   // Thông số môi trường
   lcd.setCursor(12, 0);
   lcd.print(temp);
   lcd.setCursor(12, 1);
   lcd.print(humi);
}
// xu ly du lieu
void processingData(float humid, float temp, int fire, int gas)
{
   int tmp = 0;

   if (humid < 50)
   {
      tmp++;
      warn = "DRY!";
      warn2 = "none";
   }

   if (temp > 37)
   {
      tmp++;
      warn = "TOO HOT!";
      warn2 = "hot";
   }

   if (gas > 300)
   {
      tmp++;
      hasGas = 1;
      warn = "GAS LEAK!";
      warn2 = "gas";
   }
   else
   {
      hasGas = 0;
   }

   if (fire < 200)
   {
      tmp++;
      hasFire = 1;
      warn = "FIRE!";
      warn2 = "fire";
   }
   else
   {
      hasFire = 0;
   }

   if (tmp == 0)
   {
      warn = "NO DANGER";
      warn2 = "none";
   }
}

// hien thi thong tin canh bao
void displayStatus(int hasFire, int hasGas, String state)
{
   lcd.setCursor(6, 2);
   if (hasFire)
   {
      lcd.print("YES");
   }
   else
   {
      lcd.print("NO ");
   }
   lcd.setCursor(16, 2);
   if (hasGas)
   {
      lcd.print("YES");
   }
   else
   {
      lcd.print("NO ");
   }
   lcd.setCursor(9, 3);
   lcd.print("           ");
   lcd.setCursor(9, 3);
   lcd.print(state);
}

/***************  khoi tao **********************/
void setup()
{
   Serial.begin(baudrate);
   WiFi.begin(ssid, password);
   dht.begin();
   client.setServer(broker, port);
   client.setCallback(callback);

   // Đat che do cho cac Pin
   pinMode(ALERT_PIN, OUTPUT);
   pinMode(NORMAL_PIN, OUTPUT);
   pinMode(ERR_PIN, OUTPUT);
   pinMode(FIRE_PIN, INPUT);
   pinMode(MQ3_GAS, INPUT);
   pinMode(BUZZER_PIN, OUTPUT);
   isOn = "on";

   // khoi dong lcd
   Serial.println("Starting LCD ... ");
   lcd.init();
   lcd.begin(LCD_WIDTH, LCD_HEIGHT);
   lcd.backlight();
   lcd.setCursor(3, 0);
   lcd.print("Hello user!!!");
   lcd.setCursor(6, 1); 
   lcd.print(" ***");
   lcd.setCursor(5, 3);
   lcd.print("Team 15");
   delay(1000);

   // khoi dong RFID
   // SPI.begin();
   // mfrc522.PCD_Init();

   // ket noi wifi va broker
   connect_wifi();
   connect_broker();
}

void loop()
{

   Serial.println("-------------------------------------------------------------------------");
   // kiem tra ket noi wifi
   while (WiFi.status() != WL_CONNECTED)
   {
      changeLedState("blue");
      connect_wifi();
   }

   // kiem tra ket noi broker
   while (!client.connected())
   {
      changeLedState("blue");
      connect_broker();

      lcd.clear();
      lcd.setCursor(3, 1);
      if (1)
      {
         lcd.print("System is ON!");
      }
      else
      {
         lcd.print("System is OFF!");
      }
      lcd.setCursor(4, 2);
      lcd.print("Team 15");
      delay(1000);
   }

   // doc du lieu tu buffer mqtt
   client.loop();

   if (isOn == "on")
   {

      // doc du lieu tu DHT11
      temp = dht.readTemperature(false);
      humid = dht.readHumidity();
      // doc du lieu tu MQ3
      gas = analogRead(MQ3_GAS);
      Serial.println(gas);
      gas = convert(gas);
      // doc du lieu tu cam bien lua
      fire = analogRead(FIRE_PIN);
      fire = convert(fire);

      Serial.println(temp);
      Serial.println(humid);
      Serial.println(gas);
      Serial.println(fire);

      // xu ly du lieu
      processingData(humid, temp, fire, gas);
      // hien thi du lieu
      displayInfo(temp, humid);
      displayStatus(hasFire, hasGas, warn);

      // chuyen mau led
      if (warn == "NO DANGER")
      {
         changeLedState("green");
      }
      else
      {
         changeLedState("red");
      }

      // dong goi json
      JSONVar json;

      json["id"] = idDevice;
      json["temperature"] = temp;
      json["humidity"] = humid;
      json["fire"] = fire;
      json["gas"] = gas;
      json["warn"] = warn2;

      // publish data
      client.publish(dataTopic, JSON.stringify(json).c_str());
      Serial.print("Successfully Publishing: ");
      // Serial.println(data);
      Serial.println(JSON.stringify(json));
      delay(5000);
   }
   else
   {
   }
}
