#include "library.h"
#include "GBCollector.h"

#include <iostream>

int Add(int num1, int num2){
    return num1 + num2;
};
GBCollector* Start(){
    auto* gbCollector = GBCollector::getInstance();
    return gbCollector;
}
void Write() {
    GBCollector* gc = GBCollector::getInstance();
    gc->writeJsonFile("Upload");
    std::cout << "Uploaded" << endl;
};
