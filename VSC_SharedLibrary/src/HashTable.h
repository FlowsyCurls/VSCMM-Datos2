#ifndef VSC_SHAREDLIBRARY_HASHTABLE_H
#define VSC_SHAREDLIBRARY_HASHTABLE_H


#include <map>
#include "Set.h"

template <class K, class V>
class VSC_SHAREDLIBRARY_HASHTABLE_H HashTable : multimap<K, V>{

public:
    HashTable() {
        cout << endl << "[Map-Initiate]\tEmpty!" << endl;
    }

    void print() {
        cout << "\n[KEY]\t[ELEMENT]\n";
        for (auto e = this->begin(); e != this->end(); ++e ) {
            cout << e->first << "\t\t"
                 << e->second << "\n";
        }
        cout << endl;
    }

    int length(){
        return this->size();
    }

    bool exist(const K &key) {
        auto it = this->find(key);
        return !(it==this->end());
    }

    void push(K key, V val){
        this->insert(pair<K,V>(key,val));
        cout << "[Map-Added]\t\t" << key <<"\t" << val << endl;
    }

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

    V getValue(const V &val){
        for (auto e = this->begin(); e != this->end(); ++e) {
            if (e->second == val)
                return e;
        }
        cout << "[Map-not-found]\t" << val << endl;
        return nullptr;
    }


    bool isAuthentic(const K &key){
        if(!exist(key)) return false;
        LinkedList<V>* v = getKeyVector(key);
        if (v == nullptr)
            return false;
        int i = v->size();
        return (v->size() == 1);
    }

    LinkedList<Set *> *everySet() {
        auto* vect = new LinkedList<V>;
        for (auto e = this->begin(); e != this->end(); ++e ) {
            vect->add(e->second);
        }
        return vect;
    }
};



#endif //VSC_SHAREDLIBRARY_HASHTABLE_H
