#ifndef VSC_SHAREDLIBRARY_LIBRARY_H
#define VSC_SHAREDLIBRARY_LIBRARY_H

#include "GBCollector.h"

extern "C"
{
    void Write();
    GBCollector* Start();
    int Add(int num1, int num2);
};

#endif //VSC_SHAREDLIBRARY_LIBRARY_H
