#include<iostream>
#include<conio.h>
using namespace std;
#include<stdlib.h>
#include<math.h>
#include<time.h>
#define SAMPLESIZE 4536

int active,tossval,turn=1,SYSentryN=0,USERentryN=0,victor=0;
void activeele();

class Gameele
{
	private:
	int number,digit[4],code;
	void extractor();		//Generates digits from the number
	public:
	void reader(int);		//Places the number passed as argument into the class member
	void CodeGener(Gameele&);		//System generates the code by matching it with the system's random number (if user requests)
	void CodeReader(int,int);		//Puts the user provided code into the member. (if user provides)
	void display(int);		//Depending upon the int, either only number or the number and digits with places are displayed
	int provider(int);		//Returns digit by digit or the code for SSele's matcher function to analyse
}SYSentry[100],USERentry[100],SYSnum;

class SSele
{
	private:
	int number,digit[4],status;
	void extractor();		//Generates digits from the number
	public:
	SSele()
	{
		number=0;
		for(int i=0;i<4;i++) digit[i]=0;
		status=0;
	}
	void matcher(Gameele&);		//Takes the program generated number (based on analysis) and matches code (after generating the code) with SSele
	void reader(int);		//Reads number onto the object
	int provider(int);		//Returns digit by digit or the status for the SYSmanager's analyser function
	void display();		//Displays the number if required
}element[SAMPLESIZE];

class SYSmanager
{
	private:
	int digit[4][10],spare[10],number;
	public:
	void analyzer();		//Analyses all SSele and generates data about most frequent digits in specific places
	void NumGener();		//Takes the data in digit and generates a number
	void neutraliser();		//Neutralises the digits
	void toss();		//Decides who begins first (0 then comp wins, 1 then you win)
	void SysNumGener();		//Generates a number for the system to begin the game
	void SSeleGen();		//Generates the sample space of all elements
	int provider();		//Returns the number, active elements or begin status incase needed
}SYSmanager;

class interface
{
	private:
	int checknum(int);
	public:
	void welcome();
	//semantics to be completed
	void takenum();
	void showcode();
	void shownum();
	void takecode();
	void LogGener();	
	//pending
}interface;

int main()
{
	int var=0;
	//interface.welcome();
	SYSmanager.SSeleGen();	//Generates all the elements (valid 4 digit numbers) in the sample space
	activeele();	//Updates the number of possible values and displays error message if there data provided is contradictory
	SYSmanager.toss();	//Taking instantaneous time as the variable, determines the winner of the toss (by feeding 0/1 into tossval)
	SYSmanager.SysNumGener();	//Generates a number for the system to use during the game
	var=SYSmanager.provider();	//Feeds the generated number into var
	SYSmanager.neutraliser();	//There is only one instance of the class SYSmanager, and all the variables of that instance are initialised
	SYSnum.reader(var);	//Feeds var into SYSnum (GameEle instance with the computer's number)
	if(tossval==0)
	{
		cout<<"Your opponent has won the toss and shall ask you the number first.\n";
		system("pause");
		while(victor==0)
		{
			if(turn==1)SYSmanager.SysNumGener();	//Generates a number for the system to guess and begin the game, if it is the first turn
			else
			{
				SYSmanager.analyzer();	//Otherwise generates statistics of frequency of occurrence of digits
				SYSmanager.NumGener();	//Predicts most likely digit using these statistics
			}
			var=SYSmanager.provider();	//Returns the number generated by NumGener
			SYSmanager.neutraliser();	//All variables of class instance are inititalised
			SYSentry[SYSentryN].reader(var);	//Feeds this generated number into the log record of the system's guesses
			interface.shownum();	//Displays the number guessed by the system after accessing it through the log
			interface.takecode();	//Takes the number of cows and bulls provided by the user and includes it in the log for analysis later
			if(victor!=0) cout<<"\nLooks like the system has guessed the correct number.\n"
				<<"You can take one more guess so that both sides have taken equal number of guesses.\n";
			//victor is a global variable that is updated when one of the two players have guessed the number correctly
			for(var=0;var<SAMPLESIZE;var++)
			element[var].matcher(SYSentry[(SYSentryN)-1]);
			/* The computer generated number's log is passed as argument to all elements in sample space,
			the elements which generate a different code when matched against the computer's entry are made inactive */
			activeele();	//Variable active is updated after checking with all elements in the sample space
			interface.takenum();	//The user's number is taken
			interface.showcode();	//It is matched against computer's number and number of cows & bulls is returned
		}
	}
	else if (tossval==1)
	{
		cout<<"You have won the toss. You may now ask your number.\n";
		system("pause");
		while(victor==0)
		{
			interface.takenum();
			interface.showcode();
			if(victor!=0) cout<<"\nLooks like you have guessed the correct number.\n"
				<<"You opponent shall take one more guess so that both sides have taken equal number of guesses.\n";
			if(turn==2)SYSmanager.SysNumGener();
			else
			{
				SYSmanager.analyzer();	
				SYSmanager.NumGener();
			}
			var=SYSmanager.provider();
			SYSmanager.neutraliser();
			SYSentry[SYSentryN].reader(var);
			interface.shownum();
			interface.takecode();
			for(var=0;var<SAMPLESIZE;var++)
			element[var].matcher(SYSentry[SYSentryN-1]);
			activeele();
		}
	}
	if(victor==1) cout<<"\n\nThe game has ended. You have been defeated. Better luck next time.\n"
		<<"The number chosen by your opponent was "<<SYSnum.provider(6)<<'\n';
	else if(victor==2) cout<<"\n\nCongratulations!!\nYou have won the game! Do try it once more.\n";
	else if(victor==3) cout<<"\n\nWoah! the game has ended in a draw. That was quite a neck to neck!\n";
	system("pause");
	return 0;
}

void SSele::reader(int a)
{
	number=a;
	extractor();
}

void SSele::extractor()
{
	int a=number,i;
	for(i=0;i<4;i++)
	{
		digit[i]=a%10;
		a-=digit[i];
		a/=10;	
	}	
}

void SSele::matcher(Gameele &ele)
{
	int i,j,cows=0,bulls=0;
	if(status==0)
	{
		for(i=0;i<4;i++)
		for(j=0;j<4;j++)
		if (ele.provider(i+1)==digit[j]) cows++;	//Takes every common number as a cow
		for(i=0;i<4;i++)
		if (ele.provider(i+1)==digit[i]) 
		{ cows--; bulls++; }	//Removes common digits in common places from cows' category and increments number of bulls
		i = bulls*10 + cows;	//Computes the code of the SSele instance, by comparing it againts Gameele instance
		if(i==ele.provider(5)) status=0;	//Updates status accordingly
		else status=1;	
	}
}

int SSele::provider(int a)
{
	switch(a)
	{
		case 1: return digit[0]; break;
		case 2: return digit[1]; break;
		case 3: return digit[2]; break;
		case 4: return digit[3]; break;
		case 5: return status; break;
		case 6: return number; break;
		default: cout<<"\nERROR! SSele\n";break;		
	}
	return 0;
}

void SSele::display()
{
	cout<<"\nThe number stored in this object is\t"<<number<<endl;
}

void Gameele::extractor()
{
	int a=number,i;
	for(i=0;i<4;i++)
	{
		digit[i]=a%10;
		a-=digit[i];
		a/=10;	
	}	
}

int Gameele::provider(int a)
{
	switch(a)
	{
		case 1: return digit[0]; break;
		case 2: return digit[1]; break;
		case 3: return digit[2]; break;
		case 4: return digit[3]; break;
		case 5: return code; break;
		case 6: return number; break;
		default: cout<<"\nERROR! Gameele\n";break;		
	}
	return 0;
}

void Gameele::display(int a)
{
	cout<<"\nThe number stored in this object is\t"<<number<<endl;
	if(a==1) cout<<"The number in the units place is\t"<<digit[0]
		<<"\nThe number in the tens place is\t"<<digit[1]
		<<"The number in the hundreds place is\t"<<digit[2]
		<<"The number in the thousands place is\t"<<digit[3]<<endl;
}

void Gameele::reader(int a)
{
	number=a;
	extractor();
}

void Gameele::CodeReader(int a, int b)
{
	code = (10*a) + b;
}

void Gameele::CodeGener(Gameele &a)
{
	int i,j,cows=0,bulls=0;
	for(i=0;i<4;i++)
	for(j=0;j<4;j++)
	if (a.provider(i+1)==digit[j]) cows++;
	for(i=0;i<4;i++)
	if (a.provider(i+1)==digit[i]) 
	{ cows--; bulls++; }
	code = bulls*10 + cows;
}

void SYSmanager::toss()
{
	time_t a; unsigned int b=0;
	time(&a);
	b = (unsigned) a;
	tossval=b%2;
}

void SYSmanager::SysNumGener()
{
	time_t t; unsigned int v=0;
	int i=3,j=0,k=0,l=0,place[4],u=0;
	number=0;
	time(&t); v=(unsigned)t;
	for(j=0;j>-1;j++)
	{
		u=pow(10,j+1);
		k=v%u;
		u=pow(10,j);
		k-=v%u;
		k/=u;	//Steps till here extract the (j+1)th digit from the right into k
		if(v%u==v)	//Takes new number if all the digits in present number get exhausted before extraction of 4 valid digits
		{
			j=0; time(&t);
			v=(unsigned)t;
			continue;	
		}
		if(i==3&&k==0) continue;	//If first digit from the left is 0, it is invalid
		else if(i!=3)
		{
			for(l=3;l>i;l--)	//Loop checks for duplication of digit in all places till there from the left
			if(place[l]==k)
			{
				k=-1; break;
			}
		}
		if(k==-1) continue;
		place[i]=k; i--;	//Accepts digit if it doesn't get rejected till here
		if(i==-1) break;	//Exits loop after all 4 digits are extracted
	}
	for(i=0;i<4;i++)
	number+=place[i]*pow(10,i);	//Computes number from the digits
}

void SYSmanager::SSeleGen()
{
	int i=1,j=0,k=0,l=0,n,count=0;
	for(i=1;i<10;i++)
	{
		for(j=0;j<10;j++)
		{
			if(j!=i)
			{
				for(k=0;k<10;k++)
				{
					if(k!=i && k!=j)
					{
						for(l=0;l<10;l++)
						{
							if(l!=i && l!=j && l!=k)	//Matrix of if and for statements ensures that all four digits are distinct
							{
								n=(1000*i)+(100*j)+(10*k)+l;
								element[count].reader(n);	//Feeds n into the (count)th sample space element 
								count++;
							}
						}
					}
				}
			}
		}
	}
}

void SYSmanager::analyzer()
{
	int i,j,k,v,pos=0;
	for(j=1;j<5;j++)
	for(i=0;i<SAMPLESIZE;i++)	//Generates a 2D array with stats of occurrence of each digit in each place (place X digit)
		if(element[i].provider(5)==0)
		{
			v=element[i].provider(j);
			digit[j-1][v]++; //place X digit	
		}
	for(i=0;i<4;i++)
	{
		for(j=0;j<10;j++)	//Sorts different digits according to the decreasing frequency of their occurrence into a 1D array
		{	
			v=digit[i][0];
			pos=0;
			for(k=0;k<10;k++)
			{
				if(digit[i][k]>v)
				{
					v=digit[i][k];
					pos=k;	
				}
			}
			spare[j]=pos;
			digit[i][pos]=-1;	
		}
		for(k=0;k<10;k++)	//Copies the contents from 1D array into the apt column of 2D array
		digit[i][k]=spare[k];
	}
}

void SYSmanager::NumGener()	
{
	int i=0,j=0,k=0,v=0,score=0,scoreref=40;
	for(j=0;j<SAMPLESIZE;j++)
	{
		if(element[j].provider(5)==0)	//Only processes active elements in sample space
		{
			score=0;
			for(i=0;i<4;i++)
			{
				v=element[j].provider(i+1);	//Takes (i+1)th digit of the number 
				for(k=0;k<10;k++)
					if(v==digit[i][k]) break;	//Looks for its position in apt column of 2D array
				if(k==10) //Exits if required digit is not there in the column at all
				{
					cout<<"\nError in NumGener()\n";
					system("pause");
					exit(1);
				}
				score+=k;	//Computes score of the number
			}
			if(score<scoreref)	//Lesser the score is, more is the chance of it being the number as it works on stats generated in 2D array
			{
				scoreref=score;
				number=element[j].provider(6);
			}
		}
	}
}

int SYSmanager::provider()
{
	return number;
}

void SYSmanager::neutraliser()
{
	int i,j;
	for(i=0;i<4;i++)
	for(j=0;j<10;j++)
	digit[i][j]=0;
	for(j=0;j<10;j++) spare[j]=0;
	number=0;
}

void interface::welcome()
{
	
}

int interface::checknum(int a)
{
	int i,j,place[4];
	if(a<1000||a>9999) return 1;
	for(i=0;i<4;i++)
	{
		place[i]=a%10;
		a-=place[i];
		a/=10;	
	}
	for(i=0;i<4;i++)
	for(j=i+1;j<4;j++)
	if(place[i]==place[j])	return 1;
	return 0;
}

void interface::takenum()
{
	int number=1;
	cout<<"\nThis is turn number: "<<turn<<'\n';
	while(number>0)
	{
		cout<<"Please enter the number which you want to match against the opponent's number\n";
		cin>>number;
		if(checknum(number)==1)
		{
			cout<<"\nThe number entered is invalid. Please repeat.\n";
			continue;
		}
		else break;	
	}
	USERentry[USERentryN].reader(number);
}

void interface::showcode()
{
	int code, cows, bulls;
	USERentry[USERentryN].CodeGener(SYSnum);
	code=USERentry[USERentryN].provider(5);
	cows=code%10; bulls=(code-cows)/10;
	cout<<"The number of:\n(1)\tCows = "<<cows<<"\n(2)\tBulls = "<<bulls<<'\n';
	if(cows==0&&bulls==4) 
	{
		if(victor==0) victor=2;
		else victor=3;
	}
	USERentryN++; turn++;
}

void interface::shownum()
{
	cout<<"\nThis is turn number: "<<turn<<'\n';
	cout<<"Please enter the number of cows and bulls for "<<SYSentry[SYSentryN].provider(6);
}

void interface::takecode()
{
	int cows=0,bulls=0;
	while(cows>-1)
	{
		cout<<"\nEnter number of cows: ";
		cin>>cows;
		cout<<"Enter number of bulls: ";
		cin>>bulls;
		if(cows<5&&bulls<5&&cows+bulls<5) break;
		else
		{
			cout<<"\nThe numbers entered are invalid. Please repeat the process.\n";
			cows=0;bulls=0;
			continue;
		}
	}
	if(cows==0&&bulls==4) 
	{
		if(victor==0) victor=1;
		else victor=3;
	}
	SYSentry[SYSentryN].CodeReader(bulls,cows);
	SYSentryN++; turn++;
}

void activeele()
{
	active=0;
	for (int i=0;i<SAMPLESIZE;i++)
	if(element[i].provider(5)==0) active++;
	if(active==0)
	{
		cout<<"\nThere seems to be a flaw in the data given by you because your entries are inconsistent"
			<<"\nYou will have to exit the application and begin once more.\n";
		system("pause");
		exit(1);
	}
}

