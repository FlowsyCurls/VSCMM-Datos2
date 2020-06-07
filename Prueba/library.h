#ifndef PRUEBA_LIBRARY_H __attribute__((visibility("default")));
#define PRUEBA_LIBRARY_H

extern "C"
{
    int Subtract(int num1, int num2);
    int Add(int num1, int num2);
    void Write();
};

#endif //PRUEBA_LIBRARY_H