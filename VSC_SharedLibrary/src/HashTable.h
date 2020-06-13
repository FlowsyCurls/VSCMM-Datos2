#ifndef VSC_SHAREDLIBRARY_HASHTABLE_H
#define VSC_SHAREDLIBRARY_HASHTABLE_H


#include <map>
#include "Set.h"

template <class K, class V>
class VSC_SHAREDLIBRARY_HASHTABLE_H HashTable : multimap<K, V>{

public:

    /**
     * HashTable class constructor.
     */
    HashTable() {
        cout << endl << "[Map-Initiate]\tEmpty!" << endl;
    }

    /**
     * Print the elements inside the HashTable.
     */
    void print() {
        cout << "\n[KEY]\t[ELEMENT]\n";
        for (auto e = this->begin(); e != this->end(); ++e ) {
            cout << e->first << "\t\t"
                 << e->second << "\n";
        }
        cout << endl;
    }
    /**
     * Function that calculates the size of the HashTable.
     * @return int
     */
    int length(){
        return this->size();
    }

    /**
     * Function verify if a key exists inside HashTable.
     * @param key
     * @return bool
     */
    bool exist(const K &key) {
        auto it = this->find(key);
        return !(it==this->end());
    }

    /**
     * Add the parameter val to the HashTable using the provided key.
     * @param key
     * @param val
     */
    void push(K key, V val){
        this->insert(pair<K,V>(key,val));
        cout << "[Map-Added]\t\t" << key <<"\t" << val << endl;
    }

    /**
     * Remove from the HashTable values assigned to the provided key.
     * @param key
     */
    void remove(const K &key){
        if (exist(key)) {
            LinkedList<V> *vector = getKeyVector(key);
            this->erase(key);
            for (int i = 0; i < vector->size(); ++i) {
                cout << "[Map-Removed]\t" << key << "\t" << vector->at(i) << endl;
                return;
            }
        }cout << "[Map-not-found]\t" << key << endl;
    }

    /**
     * Remove from the HashTable the value that matches the param.
     * @param val
     */
    void remove(const V &val){
        for (auto e = this->begin(); e != this->end(); ++e) {
            if (e->second == val) {
                auto key = e->first;
                this->erase(e);
                cout << "[Map-Removed]\t" << key << "\t" << val << endl;
                return;
            }
        }
        cout << "[Map-not-found]\t" << val << endl;
    }

    /**
     * Returns all elements inside the HashTable in a LinkedList.
     * @param key
     * @return LinkedList<V>
     */
    LinkedList<V>* getKeyVector(const K &key){
        if(exist(key)){
            auto* vect = new LinkedList<V>;
            auto range = this->equal_range(key);
            for (auto e= range.first; e != range.second; ++e) {
                vect->add(e->second);
            }
            return vect;
        }
        cout << "[Map-not-found]\t" << key << endl;
        return nullptr;
    }

    /**
     * Returns the value of the key that matches the param.
     * @param key
     * @return V
     */
    V getValue(const K &key) {
        if(exist(key)){
            auto range = this->equal_range(key);
            for (auto e= range.first; e != range.second; ++e) {
                if (e->first == key)
                    return e->second;
            }
        }
        cout << "[Map-not-found]\t" << key << endl;
        return nullptr;
    }

    /**
     * Returns the value that matches the param.
     * @param val
     * @return V
     */
    V getValue(const V &val){
        for (auto e = this->begin(); e != this->end(); ++e) {
            if (e->second == val)
                return e;
        }
        cout << "[Map-not-found]\t" << val << endl;
        return nullptr;
    }


    /**
     * Check if the key provided as parameter is bound to other values.
     * @param key
     * @return bool
     */
    bool isAuthentic(const K &key){
        if(!exist(key)) return false;
        LinkedList<V>* v = getKeyVector(key);
        if (v == nullptr)
            return false;
        int i = v->size();
        return (v->size() == 1);
    }

    /**
     * Returns all the Sets inside the HashTable.
     * @return
     */
    LinkedList<Set *> *everySet() {
        auto* vect = new LinkedList<V>;
        for (auto e = this->begin(); e != this->end(); ++e ) {
            vect->add(e->second);
        }
        return vect;
    }
};



#endif //VSC_SHAREDLIBRARY_HASHTABLE_H
