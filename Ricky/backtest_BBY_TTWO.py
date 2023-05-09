import backtrader as bt
import backtrader.indicators as btind
import backtrader.analyzers  as btanalyzers
import yfinance as yf 
import pandas as pd
import numpy as np
import argparse
from statsmodels.tsa.stattools import coint, adfuller
import backtrader as bt
class TestStrategy(bt.Strategy):
    params = dict(
    long_period=60,
    short_period=1,
    stake=10,
    qty1=0,
    qty2=0,
    printout=False,
    upper=2,
    medium=0.75,
    status=0,
    portfolio_value=100000,
    )
    def log(self, txt, dt=None):
      if self.p.printout:
          dt = dt or self.data.datetime[0]
          dt = bt.num2date(dt)
          print('%s, %s' % (dt.isoformat(), txt))
    def __init__(self):
        self.orderid = None
        self.qty1 = self.p.qty1
        self.qty2 = self.p.qty2
        self.upper_limit = self.p.upper
        self.lower_limit = -abs(self.p.upper)
        self.up_medium = abs(self.p.medium)
        self.low_medium = -abs(self.p.medium)
        self.status = self.p.status
        self.portfolio_value = self.p.portfolio_value
        self.data1 = self.datas[0]
        self.data2 = self.datas[1]
        self.ratio = self.datas[0]/self.datas[1]
        sma1 = bt.ind.SMA(self.ratio,period = self.p.long_period)
        sma2 = bt.ind.SMA(self.ratio,period = self.p.short_period)
        std = bt.ind.StdDev(self.ratio,period=self.p.long_period)
        self.zscore = (sma2-sma1)/std
    def next(self):
        if self.orderid:
            return # if an order is active, no new orders are allowed
        if self.p.printout:
            print('Self  len:', len(self))
            print('Data1 len:', len(self.data1))
            print('Data2 len:', len(self.data2))
            print('Data1 len == Data2 len:',len(self.data1) == len(self.data2))
            print('Data1 dt:', self.data1.datetime.datetime())
            print('Data2 dt:', self.data2.datetime.datetime())
        if (self.zscore[0] > self.upper_limit): 
            ## 
            # Calculating the number of shares for each stoc
            value = self.broker.get_cash()*0.02
            y = int(value / (self.data2.close))  
            x = int(value / (self.data1.close)) 
            self.sell(data=self.data1, size=(x+self.qty1)) 
            self.buy(data=self.data2, size=(y+self.qty2))  
            self.qty1 = x 
            self.qty2 = y  
        elif (self.zscore[0] < self.lower_limit):
            value = self.broker.get_cash()*0.02
            x = int(value / (self.data1.close)) 
            y = int(value/ (self.data2.close))  
            self.buy(data=self.data1, size=(x+self.qty1))  # Place an order for buying x + qty1 shares
            self.sell(data=self.data2, size=(y+self.qty2))  # Place an order for selling y + qty2 shares
            self.qty1 = x  # The new open position quantity for Stock1 is x shares
            self.qty2 = y  # The new open position quantity for Stock2 is y shares
        elif (self.zscore[0] < self.up_medium and self.zscore[0] > self.low_medium):
            self.close(self.data1)
            self.close(self.data2)
        
def stop(self):
        print('==================================================')
        print('Starting Value - %.2f' % self.broker.startingcash)
        print('Ending   Value - %.2f' % self.broker.getvalue())
        print('==================================================')

def parse_args():
    parser = argparse.ArgumentParser(description='MultiData Strategy')

    parser.add_argument('--ticker1', '-t1',
                        default='BBY',
                        help='1st data into the system')

    parser.add_argument('--ticker2', '-t2',
                        default='TTWO',
                        help='2nd data into the system')
    parser.add_argument('--fromdate', '-f', default='2013-01-01', help='Starting date in YYYY-MM-DD format')
    parser.add_argument('--todate', '-t',default='2023-01-31',   help='Ending date in YYYY-MM-DD format')
    parser.add_argument('--long_period', default=9, type=int)
    parser.add_argument('--cash', default=100000, type=int,help='Starting Cash')

    return parser.parse_args()

if __name__ == '__main__':
    args = parse_args()
    result = pd.DataFrame()
    sdate=args.fromdate
    edate=args.todate
    d1 = yf.download(args.ticker1, start=sdate, end=edate)
    d2 = yf.download(args.ticker2, start=sdate, end=edate)
    d2 = d2[1:]
    d1.columns =[value+'d1' for value in d1.columns]
    print(d1.columns)
    print(len(d2))
    result=d1.join(d2)
    print(d1)
    print(d2)
    result=result.dropna(axis=0)
    print(len(result))
    d1 = result[d1.columns]
    d1.columns = d2.columns
    d2 = result[d2.columns]
    data2 = bt.feeds.PandasData(dataname=d2)
    data1 = bt.feeds.PandasData(dataname=d1)
    upper = 1
    medium = 0.5
    long = 140
    short = 4
    cerebro = bt.Cerebro()
    cerebro.adddata(data1)
    cerebro.adddata(data2)
    cerebro.addstrategy(TestStrategy,
                        upper = upper,
                        medium = medium,
                        long_period = long,
                        short_period = short
                        )
    cointresult = coint(d1['Close'], d2['Close'])
    print("P-value",cointresult[1])
    cerebro.broker.setcash(100000)
    cerebro.broker.setcommission(commission=0.0035,mult=1.0)
    cerebro.addanalyzer(btanalyzers.SharpeRatio, _name = "sharpe")
    cerebro.addanalyzer(btanalyzers.DrawDown, _name = "drawdown")
    cerebro.addanalyzer(btanalyzers.Returns, _name = "returns")
    cerebro.addanalyzer(btanalyzers.SQN, _name = "systemqualitynumber")
    print("Initial Value:",cerebro.broker.get_value())
    result = cerebro.run()
    par_list = [[
                result[0].params.upper, 
                result[0].params.medium,
                result[0].params.long_period,
                result[0].params.short_period,
                result[0].analyzers.returns.get_analysis()['rnorm100'], 
                result[0].analyzers.drawdown.get_analysis()['max']['drawdown'],
                result[0].analyzers.sharpe.get_analysis()['sharperatio']
    ]
    ]
    par_df = pd.DataFrame(par_list, columns = ['upper', 'medium', 'long','short','return', 'dd','sharpe'])
    print("Result Value:",cerebro.broker.get_value())
    cerebro.plot(numfigs=1)
    result.append(par_df)
    print(par_df.head())

 
    
    