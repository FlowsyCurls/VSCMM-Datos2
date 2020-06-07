#include <zconf.h>
#include "VSPointer.h"
#include "LinkedList.h"


void hashTest(){
    auto gbCollector = GBCollector::getInstance();

    VSPointer<int> vs0 = VSPointer<int>::New();
    *vs0 = 0;
    VSPointer<int> vs1 = VSPointer<int>::New();
    *vs1 = 1;
    VSPointer<int> vs2 = VSPointer<int>::New();
    *vs2 =2;
    VSPointer<int> vs3 =  VSPointer<int>::New();
    *vs3 = 3;
    VSPointer<int> vs4 =  VSPointer<int>::New();
    *vs4 = 4;
    vs0=vs1;
    vs2=vs3;
    sleep(5);
//    vs4=vs2;
    sleep(5);

    //print element
//    gbCollector->setMap->print();
    sleep(10);
    gbCollector->print();
//    gbCollector->writeJsonFile("hey");



}


int main() {
    //tests with hash
    hashTest();
//    sleep(10);
//    gbCollector->currentPath();
}


