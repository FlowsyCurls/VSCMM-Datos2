#ifndef DATOS_2___2_0_GBCOLLECTOR_H
#define DATOS_2___2_0_GBCOLLECTOR_H

#include <map>
#include <thread>
#include <sstream>
#include <fstream>
#include <iomanip>
#include <unistd.h>
#include <cstdlib>
#include <cerrno>


#include "json.hpp"
#include "HashTable.h"
#include "LinkedList.h"
#include "Set.h"

// for convenience
using json = nlohmann::json;

class DATOS_2___2_0_GBCOLLECTOR_H GBCollector {
private:
    const string filename = "serialJson.js"; /* Json file name */
    string path; /* path for json file */
    static GBCollector *instance; /* static gbCollector instance. */

    /* Private Constructor */
    GBCollector();

    /**
    * Infinite loop for automatic sweaping memoryLeaks.
    */
    [[noreturn]] void sweapThread();

public:
    /* Empty multimap container. HashTable for Sets elements */
    HashTable<string, Set*>* setMap = new HashTable<string, Set*>;
    /* LinkedList for all VSPointers created */
    LinkedList<Set*>* generalSet = new LinkedList<Set*>;
    /* LinkedList for all T* data created */
    LinkedList<void*>* generalPtr = new LinkedList<void*>;

    /**
     * Return reference to static instance o GBCollector.
     * @return GBCollector*
     */
    static GBCollector *getInstance();

    /**
     * Returns the size of the garbage collector HashTable.
     * @return int
     */
    int length() const;

    /**
     * Show elements of the garbage collector.
     */
    void print() const;

    /**
     * Free unused allocated memory.
     */
    void sweapMemoryLeaks() const;

    /**
     * Write a Jstring of each Set in gbSets.
     */
    static string currentPath();

    void serialJson();
    static void serialJson_aux(json &gbJson, Set* set, int index);

    /**
     * Write a Jstring in a .json file
     * @param data
     */
    void writeJsonFile(const json& data);

    /**
     * Returns true for original, false for ref.
     * @param id
     * @param address
     * @return bool
     */
    bool deletePtr(const string& id, void ** address) const;

    /**
     * Returns the set that matches the entered ID. Note: Returns authentic Sets.
     * @param id
     * @return Set*
     */
    Set* getAuthentic(const string &id) const;

    /**
     * Returns the set that matches the entered ID. Note: Returns authentic Sets.
     * @param id
     * @param address
     * @return Set*
     */
    Set* getRef(const string &id, void** address) const;

    /**
     * Add to the map a new value with its own key.
     * @param id
     * @param set
     */
    void pushReference(Set *set) const;

    /**
     * Delete the authentic Set that matches the param.
     * @param id
     */
    void deleteAuthentic(const string &id) const;

    /**
     * Delete the reference Set that matches the param.
     * @param ref
     */
    void deleteReference(Set* ref) const;

    /**
     * Updates the id and pointed memory address of the pointers involved
     * when creating or deleting a reference.
     * @param id
     * @param tId
     * @param vsAddress
     */
    void update(const string& pointedID, const string& referrerID, void** pointedAddress, void** referrerAddress)const;


    /**
     * Updates the pointedTo attribute of the referrer Set and its references.
     * @param pointed
     * @param referrer
     */
    void updateRefsPointTo(Set *pointed, Set *referrer) const;

    /**
     * Updates the referrer pointTo attribute to the pointed, if the pointed is referring to someone,
     * updates pointTo to this one then.
     * @param pointed
     * @param referrer
     */
    void updatePointTo(Set *pointed, Set *referrer) const;



};


#endif //DATOS_2___2_0_GBCOLLECTOR_H
