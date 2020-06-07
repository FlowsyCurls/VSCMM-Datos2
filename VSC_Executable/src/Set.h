#ifndef DATOS_2___2_0_SET_H
#define DATOS_2___2_0_SET_H

#include <iostream>
#include <string>
#include "LinkedList.h"

using namespace std;

class DATOS_2___2_0_SET_H Set {
public:
    /* Set id. */
    string id;
    /* Set type. */
    string type;
    /* Address of the pointer. */
    void* vsAddress;
    /* Value of the pointer. */
    void* vsData;
    /* Reference Vector. */
    LinkedList<void**>* refsList = new LinkedList<void**>;
    /* Reference to the pointer it points to */
    Set* pointingTo = nullptr;

    /**
     * Set class constructor.
     * @param id
     * @param type
     * @param vsData
     * @param vsAddress
     */
    Set(const string& id, const string& type, void *vsData, void *vsAddress);

    /**
     * Print the Set attributes.
     */
    void toString() const;

    /**
     * Returns the memory address the pointer points to.
     * @return void**
     */
    void** getDataAddress() const;

    /**
     * Returns the memory address of the pointer.
     * @return void**
     */
    void** getVsAddress() const;

    /**
     * Returns the value of the memory address the pointer points to. It's casted to its original type.
     * @return string
     */
    string getValueData() const;

    /**
     * Remove address from refsList
     * @param address
     */
    void removeAddress(void** address) const;
};


#endif //DATOS_2___2_0_SET_H
