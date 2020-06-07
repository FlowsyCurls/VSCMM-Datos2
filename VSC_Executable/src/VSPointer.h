#ifndef DATOS_2___2_0_VSPOINTER_H
#define DATOS_2___2_0_VSPOINTER_H

#include "GBCollector.h"
#include "Set.h"

template <class T>
class DATOS_2___2_0_VSPOINTER_H VSPointer {
/* Garbage collector static instance */
    GBCollector* gbCollector = GBCollector::getInstance();

public:
    /* Pointer */
    T* data;
    /* Pointer id */
    string id;
    /* Pointer type */
    string type;
    /* Pointer memory address */
    void** address = nullptr;

    /**
     * VSPointer class constructor.
     * @param p
     */
    explicit VSPointer(T value){
        data = (typeof(*data)*)malloc(sizeof(*data));
        type = typeid(*data).name();
        id = "id" + to_string(gbCollector->length());
        address = (void **)this;
        Set* set = new Set(id, type, data, address); //Wrap Set & push in map.
        gbCollector->setMap->push(id, set); //push in map.
        gbCollector->generalSet->add(set); //push in all set map.
        gbCollector->generalPtr->add(data); //push in all T addresses.
    }

    static VSPointer<T> New() {
        return VSPointer<T>(T());
    }
    /**
     * VSPointer class destructor.
     * Delete T* and free its memory.
     */
    ~VSPointer() {
        if(gbCollector->deletePtr(id, reinterpret_cast<void**>(this)))
            free (data);
    }

    /**
     * Now ampersand dereferences the pointer value.
     * @return T
     */
    T operator &(){
        return *data;
    }

    /**
     * Overload * operator.
     * @return T&
     */
    T& operator *(){
        return *data;
    }

    /**
     * Overloaded arrow operator.
     * @return T*
     */
    T* operator -> (){
        return data;
    }

    /**
     * Check the type matching before coping the pointed data to the data.
     * @param pointed
     * @return VSPointer&
     */
    VSPointer& operator=(VSPointer pointed){
        cout << "\n[Operator(=)]\t( " << id << ", " << *data << " )\t->\t( "
        << pointed.id << ", " << *pointed.data << " )" << endl;
        gbCollector->update(pointed.id, id, pointed.address,reinterpret_cast<void **>(this));
        id = pointed.id;
    }

    /**
     * Operator "=" overload on all supported variable types.
     * @param target
     * @return VSPointer&
     */
    VSPointer& operator=(int target){verifyType(typeid(&target).name(), target);}
    VSPointer& operator=(char target){verifyType(typeid(&target).name(), target);}
    VSPointer& operator=(bool target){verifyType(typeid(&target).name(), target);}
    VSPointer& operator=(long target){verifyType(typeid(&target).name(), target);}
    VSPointer& operator=(short target){verifyType(typeid(&target).name(), target);}
    VSPointer& operator=(float target){verifyType(typeid(&target).name(), target);}
    VSPointer& operator=(double target){verifyType(typeid(&target).name(), target);}
    VSPointer& operator=(long long target){verifyType(typeid(&target).name(), target);}
    VSPointer& operator=(long double target){verifyType(typeid(&target).name(), target);}

    /**
     * Check the type matching before switching the value of the pointer to the target value.
     * @param type
     * @param target
     */
    void verifyType(const string& type2, T target){
        cout << "\n\t\tTypes: " << type << " - "<<type2 << endl;
        if (type==type2) {
            *data = target;
            return;
        }
        cout << "Operation failed, types don't match" << endl;
    }

    /**
     * Print the VSPointer information.
     */
    void toString() {
        cout << "VSP: " << this
             << "\n\tID: " << id
             << "\n\tTYPE: " << type
             << "\n\tREF_TO: " << data
             << "\n\tVALUE: " << to_string(*data)
             << "\n\thas been created..!" << endl;
    }

};

#endif //DATOS_2___2_0_VSPOINTER_H
