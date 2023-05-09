//+------------------------------------------------------------------+
//|                                                     constant.mq4 |
//|                                  Copyright© 2020. VL Blockchain. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright© 2020. VL Blockchain."
#property link "https://www.mql5.com"
#property version "1.00"
#property strict
#property indicator_separate_window
//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+

datetime timeStart = (datetime)("2010.01.01");
double money = 10000;
int tradeLimit = 10;

input int smallestMACD = 5;        // Fast MACD
input int biggestMACD = 10;        // Slow MACD
input int barsForNextTraining = 7; // Days waited before next training

string shortName = "Selenium Capital ---> [ Parabolic MACD Swing ] ";
datetime closeTime;
datetime openTime;
int recCurrentTrade = 0;
int scanRange = 0;

struct TrainingStat
{
   double consisWin;
   double consisLose;
   double winPercent;

   TrainingStat()
   {
      consisWin = 0;
      consisLose = 0;
      winPercent = 0;
   }
};
TrainingStat stat;

int counter = 0, counterMax = 10;
int optimization[][3];
int martegal = 1;
int shift;

bool brought = false;
double openValue, closeValue, openPrice, closePrice;
int basicLeverage = 50, leverage = 50, fastMACD, slowMACD, signalMACD;
bool win;

int OnInit()
{
   //--- indicator buffers mapping
   ArrayResize(optimization, counterMax);

   switch(Period())
        {
         case PERIOD_M1:

            scanRange = 60;
            break;

         case PERIOD_M5:

            scanRange = 60 * 5;
            break;

         case PERIOD_M15:

            scanRange = 60 * 15;
            break;

         case PERIOD_M30:

            scanRange = 60 * 30;
            break;

         case PERIOD_H1:

            scanRange = 60 * 60;
            break;

         case PERIOD_H4:

            scanRange = 60 * 60 * 4;
            break;

         case PERIOD_D1:

            scanRange = 60 * 60 * 24;
            break;

         case PERIOD_W1:

            scanRange = 60 * 60 * 24 * 7;
            break;

         case PERIOD_MN1:

            scanRange = 60 * 60 * 24 * 30;
            break;
        }
   //---
   return (INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
}
//+------------------------------------------------------------------+
//| Custom indicator iteration function                              |
//+------------------------------------------------------------------+

void resetBuffet()
{
   tradeLimit = 10;
   recCurrentTrade = 0;
   money = 10000;

   brought = false;
}

/*
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{*/
void OnStart()
{
   static bool valve = false;

   if (valve == false)
   {
      valve = true;

      while (counter < counterMax - 1)
      {
         stat = TrainingStat();

         shift = iBarShift(Symbol(), Period(), timeStart + (++counter) * barsForNextTraining * scanRange);

         createTraining();
         Print(" ", shift, ": ---> [ ", timeStart + (counter) * barsForNextTraining * scanRange, " ] ", optimization[counter][0], " ---> ", optimization[counter][1], " ---> ", optimization[counter][2], " ---> ", stat.winPercent);
      }

      createTrading();
   }
   // return (rates_total);
}

void monteCarlo()
{
   resetBuffet();

   IndicatorShortName(shortName);

   for (int i = shift; i > 0 && recCurrentTrade < tradeLimit; i--)
   {
      if (money < 0)
      {
         Print("You lose all your money X)");
         break;
      }

      double MACD = iMACD(NULL, 0, fastMACD, slowMACD, signalMACD, PRICE_CLOSE, MODE_MAIN, i);
      double signalLine = iMACD(NULL, 0, fastMACD, slowMACD, signalMACD, PRICE_CLOSE, 1, i);
      double MACDLast = iMACD(NULL, 0, fastMACD, slowMACD, signalMACD, PRICE_CLOSE, MODE_MAIN, i + 1);
      double signalLineLast = iMACD(NULL, 0, fastMACD, slowMACD, signalMACD, PRICE_CLOSE, 1, i + 1);

      if (MACDLast > signalLineLast && MACD < signalLine) // sell
      {
         ObjectCreate("Line" + Time[i], OBJ_VLINE, WindowFind(shortName), Time[i], 0); //(name, type, window, anchor point)
         ObjectSet("Line" + Time[i], OBJPROP_COLOR, clrRed);
         ObjectSet("Line" + Time[i], OBJPROP_STYLE, STYLE_DOT);

         if (brought == true)
         {
            ObjectSet("Line" + Time[i], OBJPROP_STYLE, STYLE_SOLID);

            closeValue = (High[i] + Low[i]) / 2;
            closePrice = ((High[i] + Low[i]) / 2) * leverage;

            int x = openTime, y = Time[i];

            double a = openValue, b = closeValue, temp;

            win = (openPrice < closePrice) ? true : false;

            if (!win)
            {
               temp = a;
               a = b;
               b = temp;
            }

            ObjectCreate("Rekt" + Time[i], OBJ_RECTANGLE, 0, x, a, y, b);

            if (!win)
            {
               ObjectSet("Rekt" + Time[i], OBJPROP_COLOR, clrRed);
               leverage *= martegal;
               stat.consisLose++;
            }
            else
            {
               ObjectSet("Rekt" + Time[i], OBJPROP_COLOR, clrGreen);
               leverage = basicLeverage;
               stat.consisWin++;
            }

            // Print("Win rate: ", consisWin / (consisWin + consisLose));
            // Print(Time[i], " : [ (", i, ") ] ---> [ Buy at: ", openValue, " ] ---> [ Close at: ", closeValue, " ] ---> [ ", ((win) ? "win" : "loss"), " ] ");

            recCurrentTrade++;

            // Print(Time[i], " : [ ", (brought ? "sell" : "buy"), " (", recCurrentTrade, " / ", tradeLimit, " ) ] ---> [ ( ", money + closePrice, " ) = ", money, " + ", closePrice, " ] ---> [ ", ((win) ? "win" : "loss"), " ] ");

            money += closePrice;
            openPrice = 0;
            brought = false;
         }
      }

      if (MACDLast < signalLineLast && MACD > signalLine) // buy
      {
         ObjectCreate("Line" + Time[i], OBJ_VLINE, WindowFind(shortName), Time[i], 0); //(name, type, window, anchor point)
         ObjectSet("Line" + Time[i], OBJPROP_COLOR, clrGreen);
         ObjectSet("Line" + Time[i], OBJPROP_STYLE, STYLE_DOT);

         if (brought == false)
         {
            ObjectSet("Line" + Time[i], OBJPROP_STYLE, STYLE_SOLID);
            openValue = (High[i] + Low[i]) / 2;
            openPrice = ((High[i] + Low[i]) / 2) * leverage;
            openTime = Time[i];

            // Print(Time[i], " : [ ", (brought ? "sell" : "buy"), " (", i, ") ] ---> [ ", money - openPrice, " = ( ", money, " ) - ", openPrice, " ] ---> [ ", leverage, " ] ");
            money -= openPrice;
            brought = true;
         }
      }
   }
   if (stat.consisWin + stat.consisLose != 0 && stat.consisWin / (stat.consisWin + stat.consisLose) > stat.winPercent)
   {
      optimization[counter][0] = fastMACD;
      optimization[counter][1] = slowMACD;
      optimization[counter][2] = signalMACD;
      stat.winPercent = stat.consisWin / (stat.consisWin + stat.consisLose);
   }
   // Sleep(1000);
   // Print(" [ ", fastMACD, ", ", slowMACD, ", ", signalMACD, " ] - Win rate: ", stat.consisWin / (stat.consisWin + stat.consisLose));
}

void createTraining() // Forward training
{
   int arrSize = biggestMACD + 1;

   for (int i = smallestMACD; i < arrSize; i++)
   {
      for (int j = smallestMACD; j < arrSize; j++)
      {
         if (i < j && i != j)
         {
            for (int k = smallestMACD; k < arrSize; k++)
            {
               if (j != k && k != i)
               {
                  fastMACD = i;
                  slowMACD = j;
                  signalMACD = k;
                  monteCarlo();

                  ObjectsDeleteAll();
               }
            }
         }
      }
   }
}

void createTrading()
{
   fastMACD = optimization[counter][0];
   slowMACD = optimization[counter][1];
   signalMACD = optimization[counter][2];
   monteCarlo();
}
//+------------------------------------------------------------------+
