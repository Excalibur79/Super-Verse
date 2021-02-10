import pandas
import requests

dataarray=[]
df=pandas.read_csv("dataset.csv",encoding='ANSI')

def upload():
    url="https://excalibur-superverse.herokuapp.com/superverse/naruto/createcharacters"   
    data=(dataarray)
    #print(data)
    x=requests.post(url,json=data)
    print(x)
for i in range(1,len(df),1):
    if df['name'][i]!='Yura' and df['name'][i]!='Fourth Mizukage' and df['name'][i]!='Utakata' and df['name'][i]!='Yukimaru':
        ob={}
        ob['name']=df['name'][i]
        ob['url']=df['url'][i]
        ob['theme']=df['theme'][i]
        ob['attack']=df['attack'][i]
        ob['defence']=df['defence'][i]
        ob['health']=df['health'][i]
        ob['total_health']=df['total_health'][i]
        ob['base_price']=df['base_price'][i]
       
        if df['transformable'][i]==1:
            ob['transformable']=True
        else:
            ob['transformable']=False

        if type(df['next_character'][i]) == str:
            ob['next_character']=df['next_character'][i]
        else:
            ob['next_character']=''
        ob['dp']=df['dp'][i]

        dataarray.append(ob)
upload()