#ifndef DATOS_2___2_0_LINKEDLIST_H
#define DATOS_2___2_0_LINKEDLIST_H

#include <iostream>

using namespace std;

template<class T>
struct node {
    node<T>* next;
    T data;
};

template<class T>
class DATOS_2___2_0_LINKEDLIST_H LinkedList
{
    node<T>* first;
    node<T>* last;
    int length=0;

public:
    LinkedList<T>() {
        first = NULL;
        last = NULL;
        length = 0;
    }

    int size()  {
        return length;
    }

    bool isEmpty() {
        return (length==0);
    }

    void add(T data) {
        if (!first) {
            // The list is empty
            first = new node<T>;
            first->data = data;
            first->next = NULL;
            last = first;
        } else {
            // The list isn't empty
            if (last == first) {
                // The list has one element
                last = new node<T>;
                last->data = data;
                last->next = NULL;
                first->next = last;
            } else {
                // The list has more than one element
                auto* insdata = new node<T>;
                insdata->data = data;
                insdata->next = NULL;
                last->next = insdata;
                last = insdata;
            }
        }length++;
    }

    T operator[](int index) {
        return at(index);
    }

    void removeByObject(T key) {
        if (isEmpty()) {
            cout << "The list is empty" << endl;
        } else if (first->data == key){
            node<T>* current = first;
            first = first->next;
            delete current;
            length--;
        }else{
            node<T>* previous = first;
            node<T>* current = first->next;
            while(current != last) {
                if(current->data == key) {
                    break;
                }
                else {
                    previous = current;
                    current = current->next;
                }
            }
            if (current == last) {
                if (current->data != key) {
                    cout << "Can't remove list_value: no match found.\n";
                    return;
                } else {
                    first, last = NULL;
                    delete current;
                    this->length--;
                }
            } else{
                previous->next = current->next;
                delete current;
                this->length--;
            }
        }
    }

    void removeByInt(int i) {
        if (isEmpty() || i > size() - 1) {
            return;
        }
        if (size() == 1 && i == 0) {
            last, first = NULL;
        } else if (i==0){
            first = first->next;
        }else{
            int j = 0;
            node<T> *prev = first;
            node<T> *current = first->next;
            while (j+1 != i) {
                prev = current;
                current = current->next;
                j++;
            }
            if (j == size() - 1) {
                first, last = NULL;
                delete current;
            }else {
                prev->next = current->next;
            }
        }
        this->length--;
    }

    T at(int index) {
        if(index == 0) {
            // Get the first element
            return this->first->data;
        } else {
            // Get the index'th element
            node<T>* curr = this->first;
            for(int i = 0; i < index; ++i) {
                curr = curr->next;
            }
            return curr->data;
        }
    }

    void print() {
        if (isEmpty()) {
            cout << "[]" << endl;
            return;
        }
        node<T> *curr = first;
        cout << "List - " << "[ ";
        for (int i = 0; i < length; ++i) {
            cout << curr->data << " ";
            curr = curr->next;
        }cout << "]" <<endl <<endl;
    }


};

#endif //DATOS_2___2_0_LINKEDLIST_H
